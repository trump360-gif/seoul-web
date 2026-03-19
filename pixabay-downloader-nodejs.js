#!/usr/bin/env node

/**
 * 픽사베이 이미지 자동 검색 및 다운로드 도구 (Node.js)
 * 
 * 사용법: node pixabay-downloader.js --api-key YOUR_API_KEY --query "검색어" --count 20
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const commander = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const cliProgress = require('cli-progress');
const sanitize = require('sanitize-filename');

// 프로그램 버전 및 설명 설정
const program = new commander.Command();
program
  .version('1.0.0')
  .description('픽사베이 이미지 자동 검색 및 다운로드 도구');

// 명령행 옵션 설정
program
  .requiredOption('-k, --api-key <key>', '픽사베이 API 키 (필수)')
  .requiredOption('-q, --query <query>', '검색어 (필수)')
  .option('-n, --count <number>', '다운로드할 이미지 수', parseInt, 10)
  .option('-o, --output <path>', '이미지 저장 경로', './downloaded_images')
  .option('-t, --type <type>', '이미지 유형 (all, photo, illustration, vector)', 'all')
  .option('-r, --orientation <orientation>', '이미지 방향 (all, horizontal, vertical)', 'all')
  .option('-c, --category <category>', '이미지 카테고리')
  .option('-w, --min-width <width>', '최소 이미지 너비', parseInt, 0)
  .option('-h, --min-height <height>', '최소 이미지 높이', parseInt, 0)
  .option('--colors <colors>', '색상 필터 (쉼표로 구분)')
  .option('--editors-choice', '에디터 선택 이미지만 검색', false)
  .option('--no-safesearch', '안전 검색 비활성화')
  .option('--order <order>', '정렬 순서 (popular, latest)', 'popular')
  .option('--max-concurrent <number>', '동시 다운로드 수', parseInt, 5);

// 명령행 인자 파싱
program.parse(process.argv);
const options = program.opts();

/**
 * 픽사베이 이미지 다운로더 클래스
 */
class PixabayDownloader {
  /**
   * 생성자
   * @param {string} apiKey - 픽사베이 API 키
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://pixabay.com/api/';
    this.imagesPerPage = 200; // 페이지당 최대 이미지 수
    this.axios = axios.create({
      timeout: 30000, // 타임아웃 30초
    });
  }

  /**
   * 픽사베이 API를 사용하여 이미지 검색
   * @param {Object} params - 검색 매개변수
   * @returns {Promise<Object>} 검색 결과
   */
  async searchImages(params) {
    try {
      // API 요청
      const response = await this.axios.get(this.baseUrl, {
        params: {
          key: this.apiKey,
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API 오류: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        throw new Error('API 서버로부터 응답이 없습니다');
      } else {
        throw new Error(`요청 설정 오류: ${error.message}`);
      }
    }
  }

  /**
   * 이미지 URL에서 이미지 다운로드
   * @param {string} imageUrl - 이미지 URL
   * @param {string} savePath - 저장 경로
   * @param {string} filename - 파일 이름
   * @returns {Promise<string>} 저장된 파일 경로
   */
  async downloadImage(imageUrl, savePath, filename) {
    try {
      // 파일 이름이 지정되지 않은 경우 URL에서 추출
      if (!filename) {
        filename = path.basename(imageUrl.split('?')[0]);
      }
      
      // 저장 경로 조합
      const fullPath = path.join(savePath, filename);
      
      // 이미지 다운로드
      const response = await this.axios.get(imageUrl, {
        responseType: 'stream'
      });
      
      // 파일로 저장
      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(fullPath);
        
        response.data.pipe(writer);
        
        writer.on('finish', () => resolve(fullPath));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`다운로드 오류 (${imageUrl}): ${error.message}`);
    }
  }

  /**
   * 검색어로 이미지 검색하고 지정된 개수만큼 다운로드
   * @param {Object} options - 검색 및 다운로드 옵션
   * @returns {Promise<Object>} 다운로드 결과
   */
  async downloadImagesByQuery(options) {
    const {
      query,
      count = 10,
      savePath = './downloaded_images',
      imageType = 'all',
      orientation = 'all',
      category = '',
      minWidth = 0,
      minHeight = 0,
      colors = '',
      editorsChoice = false,
      safesearch = true,
      order = 'popular',
      maxConcurrent = 5
    } = options;
    
    // 저장 디렉토리 생성
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    
    // 검색어로 폴더 생성 (공백은 언더스코어로 대체)
    const queryFolder = sanitize(query).replace(/\s+/g, '_');
    const queryPath = path.join(savePath, queryFolder);
    if (!fs.existsSync(queryPath)) {
      fs.mkdirSync(queryPath, { recursive: true });
    }
    
    // 다운로드할 이미지 수에 따라 필요한 페이지 수 계산
    const pagesNeeded = Math.ceil(count / this.imagesPerPage);
    
    const imagesToDownload = [];
    let totalFound = 0;
    
    const spinner = ora('검색 중...').start();
    
    try {
      // 필요한 페이지 수만큼 검색
      for (let page = 1; page <= pagesNeeded; page++) {
        spinner.text = `페이지 ${page} 검색 중...`;
        
        // 마지막 페이지의 경우 필요한 이미지 수만 요청
        const perPage = (page === pagesNeeded)
          ? (count - (page - 1) * this.imagesPerPage)
          : this.imagesPerPage;
        
        // 검색 매개변수 설정
        const searchParams = {
          q: query,
          image_type: imageType,
          orientation,
          page,
          per_page: perPage,
          order
        };
        
        // 선택적 매개변수 추가
        if (category) searchParams.category = category;
        if (minWidth > 0) searchParams.min_width = minWidth;
        if (minHeight > 0) searchParams.min_height = minHeight;
        if (colors) searchParams.colors = colors;
        if (editorsChoice) searchParams.editors_choice = 'true';
        if (!safesearch) searchParams.safesearch = 'false';
        
        // 이미지 검색
        const result = await this.searchImages(searchParams);
        
        // 검색 결과가 없는 경우
        if (result.totalHits === 0) {
          spinner.warn(`'${query}'에 대한 검색 결과가 없습니다.`);
          return {
            query,
            totalFound: 0,
            downloaded: 0,
            savePath: queryPath,
            results: []
          };
        }
        
        // 첫 페이지에서만 총 이미지 수 표시
        if (page === 1) {
          totalFound = result.totalHits;
          spinner.text = `총 ${totalFound}개의 이미지를 찾았습니다.`;
        }
        
        // 다운로드할 이미지 정보 수집
        for (const image of result.hits) {
          imagesToDownload.push({
            id: image.id,
            url: image.largeImageURL,
            tags: image.tags
          });
        }
        
        // API 속도 제한을 피하기 위해 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 충분한 이미지를 찾았으면 종료
        if (imagesToDownload.length >= count) {
          break;
        }
      }
      
      // 이미지가 충분하지 않은 경우
      if (imagesToDownload.length < count) {
        spinner.info(`요청한 ${count}개보다 적은 ${imagesToDownload.length}개의 이미지만 찾았습니다.`);
      }
      
      // 필요한 개수로 자르기
      const selectedImages = imagesToDownload.slice(0, count);
      
      // 다운로드 정보 파일 저장
      const infoFile = path.join(queryPath, '_image_info.json');
      fs.writeFileSync(infoFile, JSON.stringify(selectedImages, null, 2), 'utf8');
      
      spinner.succeed(`총 ${selectedImages.length}개 이미지 다운로드를 시작합니다...`);
      
      // 다운로드 진행 상황 표시 바 생성
      const progressBar = new cliProgress.SingleBar({
        format: '다운로드 진행률 [{bar}] {percentage}% | {value}/{total} 이미지',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
      
      progressBar.start(selectedImages.length, 0);
      
      // 다운로드 결과를 저장할 배열
      const downloadResults = [];
      
      // 동시 다운로드를 위한 작업 그룹화
      const chunks = [];
      for (let i = 0; i < selectedImages.length; i += maxConcurrent) {
        chunks.push(selectedImages.slice(i, i + maxConcurrent));
      }
      
      // 각 그룹을 순차적으로 처리
      for (const chunk of chunks) {
        // 각 그룹 내에서 동시에 다운로드
        const chunkPromises = chunk.map(async (imageInfo) => {
          try {
            const { id, url, tags } = imageInfo;
            
            // 파일 이름 생성 (ID와 태그 포함)
            const firstTag = tags.split(',')[0].trim().replace(/\s+/g, '_');
            const filename = `${id}_${firstTag}.jpg`;
            
            // 이미지 다운로드
            const filePath = await this.downloadImage(url, queryPath, filename);
            
            // 진행 상황 업데이트
            progressBar.increment();
            
            return {
              id,
              filename,
              success: true,
              path: filePath
            };
          } catch (error) {
            // 진행 상황 업데이트
            progressBar.increment();
            
            return {
              id: imageInfo.id,
              filename: null,
              success: false,
              error: error.message
            };
          }
        });
        
        // 모든 동시 다운로드 완료 대기
        const results = await Promise.all(chunkPromises);
        downloadResults.push(...results);
      }
      
      // 진행 상황 바 종료
      progressBar.stop();
      
      // 다운로드 결과 집계
      const successful = downloadResults.filter(r => r.success).length;
      
      console.log(chalk.green(`\n다운로드 완료: ${successful}/${selectedImages.length} 성공`));
      console.log(chalk.blue(`이미지가 ${queryPath} 경로에 저장되었습니다.`));
      
      return {
        query,
        totalFound,
        downloaded: successful,
        savePath: queryPath,
        results: downloadResults
      };
      
    } catch (error) {
      spinner.fail(`오류 발생: ${error.message}`);
      throw error;
    }
  }
}

/**
 * 메인 함수
 */
async function main() {
  try {
    // 다운로더 인스턴스 생성
    const downloader = new PixabayDownloader(options.apiKey);
    
    // 검색 및 다운로드 실행
    await downloader.downloadImagesByQuery({
      query: options.query,
      count: options.count,
      savePath: options.output,
      imageType: options.type,
      orientation: options.orientation,
      category: options.category,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      colors: options.colors,
      editorsChoice: options.editorsChoice,
      safesearch: options.safesearch,
      order: options.order,
      maxConcurrent: options.maxConcurrent
    });
    
  } catch (error) {
    console.error(chalk.red(`\n오류: ${error.message}`));
    process.exit(1);
  }
}

// 스크립트 실행
main();
