import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  constructor(
    public readonly code: number,
    public readonly httpStatus: HttpStatus,
    public readonly message: string,
  ) {
    ErrorCode.values.set(code, this);
  }

  private static readonly values = new Map<number, ErrorCode>();

  // Method Not Allowed Error
  static readonly METHOD_NOT_ALLOWED = new ErrorCode(40500, HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 HTTP 메소드입니다.");

  // Not Found Error
  static readonly NOT_FOUND_END_POINT = new ErrorCode(40400, HttpStatus.NOT_FOUND, "존재하지 않는 API 엔드포인트입니다.");
  static readonly NOT_FOUND_RESOURCE = new ErrorCode(40403, HttpStatus.NOT_FOUND, "해당 리소스를 찾을 수 없습니다.");
  static readonly NOT_FOUND_ENUM = new ErrorCode(40404, HttpStatus.NOT_FOUND, "해당 열거형을 찾을 수 없습니다.");
  static readonly NOT_FOUND_UNIV = new ErrorCode(40405, HttpStatus.NOT_FOUND, "해당 대학을 찾을 수 없습니다.");
  static readonly NOT_FOUND_USER = new ErrorCode(40406, HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다.");
  static readonly NOT_FOUND_TEAM = new ErrorCode(40407, HttpStatus.NOT_FOUND, "해당 팀을 찾을 수 없습니다.");
  static readonly NOT_FOUND_IDEA = new ErrorCode(40408, HttpStatus.NOT_FOUND, "해당 아이디어를 찾을 수 없습니다.");
  static readonly NOT_FOUND_IDEA_SUBJECT = new ErrorCode(40409, HttpStatus.NOT_FOUND, "해당 아이디어 주제를 찾을 수 없습니다.");
  static readonly NOT_FOUND_SYSTEM_SETTING = new ErrorCode(40410, HttpStatus.NOT_FOUND, "시스템 설정을 찾을 수 없습니다.");
  static readonly NOT_FOUND_MEMBER = new ErrorCode(40411, HttpStatus.NOT_FOUND, "해당 멤버를 찾을 수 없습니다.");
  static readonly NOT_FOUND_APPLY = new ErrorCode(40412, HttpStatus.NOT_FOUND, "해당 지원 정보를 찾을 수 없습니다.");

  // Invalid Argument Error
  static readonly MISSING_REQUEST_PARAMETER = new ErrorCode(40000, HttpStatus.BAD_REQUEST, "필수 요청 파라미터가 누락되었습니다.");
  static readonly INVALID_ARGUMENT_FORMAT = new ErrorCode(40001, HttpStatus.BAD_REQUEST, "요청에 유효하지 않은 인자입니다.");
  static readonly INVALID_PARAMETER_FORMAT = new ErrorCode(40002, HttpStatus.BAD_REQUEST, "파라미터 형식이 잘못되었습니다.");
  static readonly INVALID_HEADER_ERROR = new ErrorCode(40003, HttpStatus.BAD_REQUEST, "유효하지 않은 헤더입니다.");
  static readonly MISSING_REQUEST_HEADER = new ErrorCode(40004, HttpStatus.BAD_REQUEST, "필수 요청 헤더가 누락되었습니다.");
  static readonly BAD_REQUEST_PARAMETER = new ErrorCode(40005, HttpStatus.BAD_REQUEST, "잘못된 요청 파라미터입니다.");
  static readonly BAD_REQUEST_JSON = new ErrorCode(40006, HttpStatus.BAD_REQUEST, "잘못된 JSON 형식입니다.");
  static readonly SEARCH_SHORT_LENGTH_ERROR = new ErrorCode(40007, HttpStatus.BAD_REQUEST, "검색어는 2글자 이상이어야 합니다.");
  static readonly INVALID_ROLE = new ErrorCode(40008, HttpStatus.BAD_REQUEST, "유효하지 않은 권한입니다.");
  static readonly INVALID_FILE = new ErrorCode(40009, HttpStatus.BAD_REQUEST, "유효하지 않은 파일입니다.");
  static readonly FAILURE_CHANGE_PASSWORD_ERROR = new ErrorCode(40010, HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다.");
  static readonly VALIDATION_ERROR = new ErrorCode(40011, HttpStatus.BAD_REQUEST, "유효성 검사 오류입니다.");
  static readonly INVALID_ADMIN_AUTH_CODE_ERROR = new ErrorCode(40012, HttpStatus.BAD_REQUEST, "관리자 인증 코드가 일치하지 않습니다.");
  static readonly CANNOT_BOOKMARK_MY_IDEA_ERROR = new ErrorCode(40013, HttpStatus.BAD_REQUEST, "본인의 아이디어는 북마크할 수 없습니다.");
  static readonly CANNOT_APPLY_MY_IDEA = new ErrorCode(40014, HttpStatus.BAD_REQUEST, "본인의 아이디어에는 지원할 수 없습니다.");
  static readonly MAX_TOTAL_CAPACITY_ERROR = new ErrorCode(40016, HttpStatus.BAD_REQUEST, "팀원 수는 6명을 초과할 수 없습니다.");
  static readonly PM_CAPACITY_ERROR = new ErrorCode(40017, HttpStatus.BAD_REQUEST, "PM은 1명을 초과할 수 없습니다.");
  static readonly PD_CAPACITY_ERROR = new ErrorCode(40018, HttpStatus.BAD_REQUEST, "디자이너는 1명을 초과할 수 없습니다.");
  static readonly FE_CAPACITY_ERROR = new ErrorCode(40019, HttpStatus.BAD_REQUEST, "프론트엔드는 3명을 초과할 수 없습니다.");
  static readonly BE_CAPACITY_ERROR = new ErrorCode(40020, HttpStatus.BAD_REQUEST, "백엔드는 3명을 초과할 수 없습니다.");
  static readonly CLOSED_APPLY_ERROR = new ErrorCode(40021, HttpStatus.BAD_REQUEST, "마감된 파트입니다.");
  static readonly ALREADY_APPLIED_IDEA_ERROR = new ErrorCode(40022, HttpStatus.BAD_REQUEST, "이미 지원한 아이디어입니다.");
  static readonly NOT_IDEA_APPLY_PERIOD_ERROR = new ErrorCode(40023, HttpStatus.BAD_REQUEST, "아이디어 지원 기간이 아닙니다.");
  static readonly DUPLICATED_PREFERENCE_ERROR = new ErrorCode(40024, HttpStatus.BAD_REQUEST, "이미 지원한 지망 순번입니다.");
  static readonly MIN_TOTAL_CAPACITY_ERROR = new ErrorCode(40025, HttpStatus.BAD_REQUEST, "팀원 수는 3명 이상이어야 합니다.");
  static readonly NOT_PROVIDER_ERROR = new ErrorCode(40026, HttpStatus.BAD_REQUEST, "아이디어의 제시자가 아닙니다.");
  static readonly NOT_MATCH_IDEA_ERROR = new ErrorCode(40027, HttpStatus.BAD_REQUEST, "해당 아이디어의 제시자와 일치하는 유저가 아닙니다.");
  static readonly APPLY_STATUS_ERROR = new ErrorCode(40028, HttpStatus.BAD_REQUEST, "지원 상태가 올바르지 않습니다.");
  static readonly NOT_MATCH_USER_ERROR = new ErrorCode(40029, HttpStatus.BAD_REQUEST, "해당 유저와 일치하는 지원 정보가 아닙니다.");
  static readonly NOT_APPLY_DELETE_PERIOD_ERROR = new ErrorCode(40030, HttpStatus.BAD_REQUEST, "지원 취소 기간이 아닙니다.");
  static readonly NOT_APPLY_ACCEPT_OR_REJECT_PERIOD_ERROR = new ErrorCode(40031, HttpStatus.BAD_REQUEST, "지원 수락 또는 거절 기간이 아닙니다.");
  static readonly NOT_IDEA_VIEWS_PERIOD_ERROR = new ErrorCode(40032, HttpStatus.BAD_REQUEST, "아이디어 조회 기간이 아닙니다.");
  static readonly INVALID_START_TIME_ERROR = new ErrorCode(40033, HttpStatus.BAD_REQUEST, "시작 시각은 00시 00분 00초여야 합니다.");
  static readonly INVALID_END_TIME_ERROR = new ErrorCode(40034, HttpStatus.BAD_REQUEST, "종료 시각은 23시 59분 59초여야 합니다.");
  static readonly NON_CONSECUTIVE_PERIOD_ERROR = new ErrorCode(40035, HttpStatus.BAD_REQUEST, "종료 시각과 다음 시작 시각이 연속적이어야 합니다.");
  static readonly INVALID_DATE_ORDER_ERROR = new ErrorCode(40036, HttpStatus.BAD_REQUEST, "날짜 순서가 올바르지 않습니다.");
  static readonly NOT_IDEA_DELETE_PERIOD_ERROR = new ErrorCode(40037, HttpStatus.BAD_REQUEST, "아이디어 삭제 기간이 아닙니다.");
  static readonly UNIV_LEADER_NOT_MATCH = new ErrorCode(40038, HttpStatus.BAD_REQUEST, "해당 유저의 대학 명과 선택한 대학 명이 일치하지 않습니다.");
  static readonly NOT_TEAM_LEADER_ERROR = new ErrorCode(40039, HttpStatus.BAD_REQUEST, "팀장이 아닙니다.");

  // Access Denied Error
  static readonly ACCESS_DENIED = new ErrorCode(40300, HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
  static readonly NOT_MATCH_AUTH_CODE = new ErrorCode(40301, HttpStatus.FORBIDDEN, "인증 코드가 일치하지 않습니다.");
  static readonly NOT_MATCH_USER = new ErrorCode(40302, HttpStatus.FORBIDDEN, "사용자 정보가 일치하지 않습니다.");

  // Unauthorized Error
  static readonly FAILURE_LOGIN = new ErrorCode(40100, HttpStatus.UNAUTHORIZED, "잘못된 아이디 또는 비밀번호입니다.");
  static readonly EXPIRED_TOKEN_ERROR = new ErrorCode(40101, HttpStatus.UNAUTHORIZED, "만료된 토큰입니다.");
  static readonly INVALID_TOKEN_ERROR = new ErrorCode(40102, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
  static readonly TOKEN_MALFORMED_ERROR = new ErrorCode(40103, HttpStatus.UNAUTHORIZED, "잘못된 토큰 형식입니다.");
  static readonly TOKEN_TYPE_ERROR = new ErrorCode(40104, HttpStatus.UNAUTHORIZED, "잘못된 토큰 타입입니다.");
  static readonly TOKEN_UNSUPPORTED_ERROR = new ErrorCode(40105, HttpStatus.UNAUTHORIZED, "지원하지 않는 토큰입니다.");
  static readonly TOKEN_GENERATION_ERROR = new ErrorCode(40106, HttpStatus.UNAUTHORIZED, "토큰 생성에 실패했습니다.");
  static readonly TOKEN_UNKNOWN_ERROR = new ErrorCode(40107, HttpStatus.UNAUTHORIZED, "알 수 없는 토큰입니다.");
  static readonly NOT_FOUND_AUTHORIZATION_COOKIE = new ErrorCode(40108, HttpStatus.UNAUTHORIZED, "쿠키를 찾을 수 없습니다. 다시 로그인해주세요.");
  static readonly NOT_FOUND_LOGIN_USER = new ErrorCode(40109, HttpStatus.UNAUTHORIZED, "로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.");


  // Conflict Error
  static readonly ALREADY_EXISTS_USER = new ErrorCode(40900, HttpStatus.CONFLICT, "중복된 아이디의 사용자가 존재합니다.");
  static readonly ALREADY_EXISTS_UNIV = new ErrorCode(40901, HttpStatus.CONFLICT, "이미 존재하는 유니브입니다.");
  static readonly ALREADY_SUBMITTED_IDEA = new ErrorCode(40902, HttpStatus.CONFLICT, "이미 아이디어를 등록한 유저입니다.");
  static readonly ALREADY_HAVE_TEAM_ERROR = new ErrorCode(40903, HttpStatus.CONFLICT, "이미 팀이 존재합니다.");
  static readonly UNIV_HAS_USERS = new ErrorCode(40904, HttpStatus.CONFLICT, "해당 대학에 소속된 사용자가 존재합니다.");

  // Internal Server Error
  static readonly INTERNAL_SERVER_ERROR = new ErrorCode(50000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다.");
  static readonly UPLOAD_FILE_ERROR = new ErrorCode(50001, HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다.");

  static of(code: number): ErrorCode {
    return ErrorCode.values.get(code) || ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
