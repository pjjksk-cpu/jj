// src/constants/surveyData.js

// [배경 설문] 실제 OPIc 시작 전 설문(직업/거주형태 + 관심사 카테고리)을 단순화해 반영
export const BACKGROUND_QUESTIONS = [
  {
    id: 'occupation',
    title: '현재 귀하의 상황과 가장 가까운 것을 선택하세요.',
    options: [
      { key: 'employed_full', label: '직장인 (전일제)' },
      { key: 'employed_part', label: '직장인 (시간제)' },
      { key: 'student', label: '학생' },
      { key: 'unemployed', label: '무직' },
      { key: 'homemaker', label: '주부' },
    ],
  },
  {
    id: 'residence',
    title: '현재 거주 형태를 선택하세요.',
    options: [
      { key: 'alone', label: '아파트/주택에 혼자 거주' },
      { key: 'family', label: '아파트/주택에 가족과 거주' },
      { key: 'dorm', label: '기숙사' },
      { key: 'roommate', label: '룸메이트와 함께 거주' },
    ],
  },
];

// 아래 카테고리는 복수 선택(1개 이상) - 답변 내용에 따라 실제 OPIc처럼 문항 주제가 달라지는 구조를 반영
export const INTEREST_CATEGORIES = [
  {
    id: 'leisure',
    title: '아래 여가 활동 중 즐기시는 것을 모두 선택하세요.',
    options: [
      { key: 'movies', label: '영화 보기' },
      { key: 'concerts', label: '공연/콘서트 관람' },
      { key: 'shopping', label: '쇼핑' },
      { key: 'cafe', label: '카페 가기' },
      { key: 'park', label: '공원 가기' },
      { key: 'gaming', label: '게임하기' },
    ],
  },
  {
    id: 'hobby',
    title: '아래 취미/관심사 중 즐기시는 것을 모두 선택하세요.',
    options: [
      { key: 'reading', label: '독서' },
      { key: 'cooking', label: '요리/베이킹' },
      { key: 'photography', label: '사진 촬영' },
      { key: 'music', label: '악기 연주' },
      { key: 'gardening', label: '원예/화초 가꾸기' },
      { key: 'pet', label: '반려동물 기르기' },
    ],
  },
  {
    id: 'sports',
    title: '아래 운동 중 즐기시는 것을 모두 선택하세요.',
    options: [
      { key: 'jogging', label: '조깅/걷기' },
      { key: 'swimming', label: '수영' },
      { key: 'cycling', label: '자전거 타기' },
      { key: 'yoga', label: '요가/필라테스' },
      { key: 'ballsports', label: '축구/농구 등 구기 종목' },
      { key: 'gym', label: '헬스/웨이트 트레이닝' },
    ],
  },
  {
    id: 'travel',
    title: '아래 여행/출장 경험 중 해당하는 것을 모두 선택하세요.',
    options: [
      { key: 'domestic_travel', label: '국내 여행' },
      { key: 'overseas_travel', label: '해외 여행' },
      { key: 'domestic_business', label: '국내 출장' },
      { key: 'overseas_business', label: '해외 출장' },
      { key: 'staycation', label: '집에서 휴가 보내기' },
    ],
  },
];

// [자가진단] 실제 OPIc의 1~6단계 자가 수준 평가를 단순화해 반영
export const SELF_ASSESSMENT_LEVELS = [
  {
    level: 1,
    label: 'Level 1',
    description:
      '나는 특정 단어나 짧은 문구를 나열해 말할 수 있다. 완전한 문장으로 말하거나 질문에 답하는 것이 어렵다.',
  },
  {
    level: 2,
    label: 'Level 2',
    description:
      '나는 일상적이고 익숙한 주제에 대해 짧고 간단한 문장으로 말할 수 있다. 준비 없이 새로운 주제로 대화를 이어가기는 어렵다.',
  },
  {
    level: 3,
    label: 'Level 3',
    description:
      '나는 익숙한 주제에 대해 간단한 대화를 할 수 있으며, 일상적인 상황에서 기본적인 의사소통이 가능하다.',
  },
  {
    level: 4,
    label: 'Level 4',
    description:
      '나는 다양한 주제에 대해 문장을 연결해 말할 수 있으며, 개인적인 경험을 비교적 자세히 설명할 수 있다.',
  },
  {
    level: 5,
    label: 'Level 5',
    description:
      '나는 친숙한 주제뿐 아니라 사회적 이슈에 대해서도 의견을 조리 있게 말할 수 있고, 예상치 못한 질문에도 어느 정도 대응할 수 있다.',
  },
  {
    level: 6,
    label: 'Level 6',
    description:
      '나는 폭넓은 주제에 대해 논리적으로 의견을 제시하고, 복잡한 상황을 설명하거나 다른 사람을 설득할 수 있다.',
  },
];
