// 企业类型
export type EnterpriseType = 'platform' | 'school-based'

// 企业类型标签
export const ENTERPRISE_TYPE_LABELS: Record<EnterpriseType, string> = {
  platform: '平台企业',
  'school-based': '校本企业',
}

// 合作主体类型（兼容旧类型，但企业档案只保留 enterprise）
export type PartnerType = 'enterprise' | 'association' | 'park' | 'institution' | 'expert'

// 合作状态
export type CooperationStatus = 'negotiating' | 'active' | 'paused' | 'terminated'

// 合作深度评级
export type CooperationRating = 'strategic' | 'deep' | 'general'

// 协议状态
export type AgreementStatus = 'draft' | 'active' | 'expired' | 'renewed' | 'terminated'

// 项目阶段
export type ProjectPhase = 'initiation' | 'execution' | 'acceptance' | 'closure' | 'archived' | 'terminated'

// 项目发布状态
export type ProjectPublishStatus = 'draft' | 'published'

// 专家评级
export type ExpertRating = 'gold' | 'silver' | 'bronze'

// 专家性别
export type ExpertGender = 'male' | 'female'

// 专家类型
export type ExpertType = '企业导师' | '测评专员' | '教学专家' | '技术顾问' | '创业导师' | '评审专家'

// 活动状态
export type ActivityStatus = 'draft' | 'published' | 'ended'

// 成果类型
export type AchievementType = 'job' | 'scene' | 'course' | 'custom'

// 企业档案
export interface Enterprise {
  id: string
  enterpriseType: EnterpriseType
  name: string
  industry: string
  region: string
  description: string
  logo?: string
  status: CooperationStatus
  rating: CooperationRating
  cooperationTypes: string[]
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  establishedYear?: number
  employeeCount?: number
  // 统一社会信用代码
  unifiedSocialCreditCode?: string
  // 营业执照照片
  businessLicensePhotos?: string[]
  // 企业合作协议（内嵌）
  agreements?: EnterpriseAgreement[]
  // 企业评级记录
  ratingRecord?: {
    rating: CooperationRating
    evaluatedAt: Date
    evaluator: string
    remark?: string
  }
  createdAt: Date
  updatedAt: Date
}

// 企业合作协议（内嵌于企业档案）
export interface EnterpriseAgreement {
  id: string
  name: string
  type: string
  startDate: Date
  endDate: Date
  status: AgreementStatus
  content?: string
  attachments?: string[]
  createdAt: Date
}

// 合作主体（兼容旧类型定义）
export interface Partner {
  id: string
  type: PartnerType
  name: string
  industry: string
  region: string
  description: string
  logo?: string
  status: CooperationStatus
  rating: CooperationRating
  cooperationTypes: string[]
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  establishedYear?: number
  employeeCount?: number
  createdAt: Date
  updatedAt: Date
}

// 合作协议
export interface Agreement {
  id: string
  name: string
  partnerId: string
  partnerName: string
  type: string
  content: string
  startDate: Date
  endDate: Date
  status: AgreementStatus
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

// 项目里程碑
export interface Milestone {
  id: string
  name: string
  description: string
  dueDate: Date
  completedDate?: Date
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
}

// 项目配套成果
export interface ProjectSupportingResult {
  id: string
  name: string
  type: string
  description: string
  createdAt: Date
}

// 项目协议
export interface ProjectAgreement {
  id: string
  name: string
  type: string
  startDate: Date
  endDate: Date
  status: AgreementStatus
  content?: string
  attachments?: string[]
  createdAt: Date
}

// 项目阶段与进展
export interface ProjectPhaseItem {
  id: string
  name: string
  description: string
  startDate: Date
  endDate?: Date
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  progress?: number
}

// 合作项目
export interface Project {
  id: string
  name: string
  partnerId: string
  partnerName: string
  partnerIds?: string[]
  type: string
  agreementId?: string
  phase: ProjectPhase
  description: string
  startDate: Date
  endDate: Date
  budget?: number
  milestones: Milestone[]
  outputs?: string[]
  rating?: number
  publishStatus: ProjectPublishStatus
  // 配套成果关联
  supportingResults?: ProjectSupportingResult[]
  // 项目协议管理
  projectAgreements?: ProjectAgreement[]
  // 项目阶段与进展
  phases?: ProjectPhaseItem[]
  createdAt: Date
  updatedAt: Date
}

// 专家
export interface Expert {
  id: string
  name: string
  gender?: ExpertGender
  partnerId?: string
  partnerName?: string
  title: string
  field: string
  expertType?: ExpertType
  specialties: string[]
  experience: number
  rating: ExpertRating
  avatar?: string
  roles: string[]
  education?: string
  achievements?: string[]
  contactEmail?: string
  contactPhone?: string
  isContactHidden?: boolean
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// 联盟活动
export interface Activity {
  id: string
  name: string
  type: string
  date: Date
  endDate?: Date
  location: string
  description: string
  status: ActivityStatus
  maxParticipants?: number
  currentParticipants: number
  organizer: string
  coverImage?: string
  createdAt: Date
  updatedAt: Date
}

// 合作成果
export interface Achievement {
  id: string
  name: string
  type: AchievementType
  partnerId?: string
  partnerName?: string
  projectId?: string
  projectName?: string
  description: string
  images?: string[]
  attachments?: string[]
  publishDate: Date
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 学校基本信息
export interface SchoolInfo {
  id: string
  name: string
  shortName: string
  logo?: string
  type: string
  province: string
  city: string
  address: string
  introduction: string
  website?: string
  contactPhone?: string
  contactEmail?: string
  studentCount?: number
  teacherCount?: number
  majorCount?: number
  establishedYear?: number
}

// 报名记录
export interface Registration {
  id: string
  activityId: string
  activityName: string
  participantName: string
  participantType: 'student' | 'teacher' | 'enterprise' | 'other'
  participantOrg: string
  contactPhone: string
  contactEmail?: string
  status: 'pending' | 'approved' | 'rejected' | 'attended'
  registeredAt: Date
}

// 统计数据
export interface DashboardStats {
  totalPartners: number
  activePartners: number
  totalProjects: number
  activeProjects: number
  totalAgreements: number
  activeAgreements: number
  totalExperts: number
  totalActivities: number
  totalAchievements: number
  partnersByType: Record<PartnerType, number>
  partnersByRating: Record<CooperationRating, number>
  projectsByPhase: Record<ProjectPhase, number>
}

// 标签映射
export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  enterprise: '企业',
  association: '行业协会',
  park: '产业园区',
  institution: '机构',
  expert: '专家',
}

export const COOPERATION_STATUS_LABELS: Record<CooperationStatus, string> = {
  negotiating: '洽谈中',
  active: '合作中',
  paused: '已暂停',
  terminated: '已终止',
}

export const COOPERATION_RATING_LABELS: Record<CooperationRating, string> = {
  strategic: '战略合作',
  deep: '深度合作',
  general: '一般合作',
}

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, string> = {
  draft: '草稿',
  active: '生效中',
  expired: '已过期',
  renewed: '已续签',
  terminated: '已终止',
}

export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  initiation: '立项阶段',
  execution: '执行阶段',
  acceptance: '验收阶段',
  closure: '结项阶段',
  archived: '已归档',
  terminated: '已终止',
}

export const PROJECT_PUBLISH_STATUS_LABELS: Record<ProjectPublishStatus, string> = {
  draft: '草稿',
  published: '已发布',
}

export const EXPERT_RATING_LABELS: Record<ExpertRating, string> = {
  gold: '金牌专家',
  silver: '银牌专家',
  bronze: '铜牌专家',
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  draft: '草稿',
  published: '已发布',
  ended: '已结束',
}

export const ACHIEVEMENT_TYPE_LABELS: Record<AchievementType, string> = {
  job: '岗位成果',
  scene: '场景成果',
  course: '课程成果',
  custom: '自定义成果',
}

// 行业列表
export const INDUSTRIES = [
  '信息技术',
  '人工智能',
  '智能制造',
  '新能源',
  '生物医药',
  '金融服务',
  '现代物流',
  '电子商务',
  '文化创意',
  '教育培训',
  '其他',
]

// 合作类型列表
export const COOPERATION_TYPES = [
  '人才培养',
  '实习实训',
  '技术研发',
  '课程共建',
  '师资培训',
  '就业合作',
  '产学研合作',
  '创新创业',
  '技能竞赛',
  '社会服务',
]

// 专家领域列表
export const EXPERT_FIELDS = [
  '信息技术',
  '人工智能',
  '智能制造',
  '企业管理',
  '人力资源',
  '财务金融',
  '市场营销',
  '教育教学',
  '职业规划',
  '创新创业',
]

// 专家角色列表
export const EXPERT_ROLES = [
  '客座教授',
  '产业导师',
  '技术顾问',
  '创业导师',
  '评审专家',
  '课程开发',
]

// 专家类型列表
export const EXPERT_TYPES: ExpertType[] = [
  '企业导师',
  '测评专员',
  '教学专家',
  '技术顾问',
  '创业导师',
  '评审专家',
]

// 活动类型列表
export const ACTIVITY_TYPES = [
  '校企交流会',
  '专题讲座',
  '技能竞赛',
  '招聘会',
  '签约仪式',
  '成果展示',
  '研讨会',
  '培训活动',
]

// ==================== 合作权限管理类型（新版）====================

// 合作账号类型：企业公共账号 / 专家个人账号
export type CooperationAccountType = 'enterprise_public' | 'expert_personal'

export const COOPERATION_ACCOUNT_TYPE_LABELS: Record<CooperationAccountType, string> = {
  enterprise_public: '企业公共账号',
  expert_personal: '专家个人账号',
}

// 合作账号
export interface CooperationAccount {
  id: string
  accountType: CooperationAccountType
  ownerId: string        // 关联的企业ID或专家ID
  ownerName: string      // 企业名称或专家姓名
  ownerEntityType: 'enterprise' | 'expert'
  accountName: string    // 账号显示名称
  username: string       // 登录账号
  password: string       // 登录密码
  contactPerson: string
  contactPhone: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// 资源类型
export type ResourceType = 'position' | 'scene' | 'course'

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  position: '岗位管理',
  scene: '场景管理',
  course: '课程管理',
}

// 操作类型
export type OperationType = 'view' | 'edit' | 'review' | 'publish' | 'delete'

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  view: '查看',
  edit: '编辑',
  review: '审核',
  publish: '发布',
  delete: '删除',
}

// 资源权限项（资源类型 + 批次 + 操作）
export interface ResourcePermissionItem {
  id: string
  resourceType: ResourceType
  batchName: string
  operations: OperationType[]
}

// 测评类型
export type AssessmentType = 'on_site_qa' | 'on_site_review' | 'question_bank' | 'exam_paper'

export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  on_site_qa: '现场问答',
  on_site_review: '现场评审',
  question_bank: '题库',
  exam_paper: '试卷',
}

// 平台类型
export type PlatformType = 'job' | 'scene' | 'brand'

export const PLATFORM_TYPE_LABELS: Record<PlatformType, string> = {
  job: '岗位平台',
  scene: '场景平台',
  brand: '品牌平台',
}

// 权限授权记录
export interface PermissionGrant {
  id: string
  accountId: string
  accountName: string
  accountType: CooperationAccountType
  ownerName: string

  resourcePermissions: ResourcePermissionItem[]
  assessmentPermissions: AssessmentType[]
  authorizedPlatforms: PlatformType[]

  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

// ==================== 品牌运营管理类型 ====================

// 品牌等级
export type BrandLevel = 'recommended' | 'key' | 'standard'

// 品牌状态
export type BrandStatus = 'draft' | 'pending' | 'published' | 'archived'

// 人才品牌 - 学生能力画像排名
export interface TalentProfile {
  id: string
  studentId: string
  studentName: string
  major: string
  department: string
  grade: string
  avatar?: string
  abilityScore: number
  certificationLevel: string
  taskCompletionRate: number
  comprehensiveRank: number
  abilityTags: string[]
  employmentStatus?: 'employed' | 'seeking' | 'studying'
  employmentCompany?: string
  employmentPosition?: string
  isFeatured: boolean
  updatedAt: Date
}

// 人才品牌 - 典型就业案例
export interface EmploymentCase {
  id: string
  studentName: string
  major: string
  graduationYear: number
  company: string
  companyLogo?: string
  position: string
  salary?: string
  abilityTags: string[]
  story: string
  photo?: string
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 岗位品牌
export interface JobBrand {
  id: string
  name: string
  industry: string
  level: BrandLevel
  description: string
  abilityModel: string[]
  suitableMajors: string[]
  averageSalary?: string
  demandCount: number
  featureTags: string[]
  coverImage?: string
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 专业品牌
export interface MajorBrand {
  id: string
  name: string
  department: string
  level: BrandLevel
  introduction: string
  cultivationGoal: string
  coreCourses: string[]
  employmentDirections: string[]
  cooperationPartners: string[]
  featuredAchievements: string[]
  studentCount: number
  employmentRate: number
  coverImage?: string
  promoVideo?: string
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 师资品牌 - 校本师资
export interface TeacherBrand {
  id: string
  name: string
  department: string
  title: string
  type: 'dual-qualified' | 'teaching-master' | 'backbone' | 'award-winning'
  avatar?: string
  introduction: string
  researchFields: string[]
  achievements: string[]
  courses: string[]
  awards: string[]
  isFeatured: boolean
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 文化思政品牌
export interface CultureBrand {
  id: string
  name: string
  type: 'case' | 'resource' | 'activity' | 'award'
  description: string
  content: string
  images?: string[]
  attachments?: string[]
  relatedMajor?: string
  coverImage?: string
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 品牌专题页
export interface BrandTopic {
  id: string
  name: string
  theme: string
  description: string
  coverImage?: string
  layout: 'grid' | 'timeline' | 'magazine'
  content: {
    type: 'text' | 'image' | 'video' | 'link'
    title?: string
    content: string
  }[]
  relatedBrands: {
    type: 'talent' | 'partner' | 'job' | 'major' | 'teacher' | 'culture'
    ids: string[]
  }[]
  startDate?: Date
  endDate?: Date
  isRecommended: boolean
  status: BrandStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 品牌等级标签
export const BRAND_LEVEL_LABELS: Record<BrandLevel, string> = {
  recommended: '推荐品牌',
  key: '重点品牌',
  standard: '标准品牌',
}

// 品牌状态标签
export const BRAND_STATUS_LABELS: Record<BrandStatus, string> = {
  draft: '草稿',
  pending: '待审核',
  published: '已发布',
  archived: '已归档',
}

// 师资类型标签
export const TEACHER_TYPE_LABELS: Record<TeacherBrand['type'], string> = {
  'dual-qualified': '双师型教师',
  'teaching-master': '教学名师',
  backbone: '骨干教师',
  'award-winning': '获奖教师',
}

// 文化品牌类型标签
export const CULTURE_TYPE_LABELS: Record<CultureBrand['type'], string> = {
  case: '典型案例',
  resource: '思政资源',
  activity: '文化活动',
  award: '获奖成果',
}

// ==================== 就业服务管理类型 ====================

// 岗位状态
export type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'filled'

// 岗位类型
export type JobType = 'full-time' | 'part-time' | 'internship' | 'apprentice'

// 工作性质
export type WorkNature = 'on-site' | 'remote' | 'hybrid'

// 投递状态
export type ApplicationStatus = 'pending' | 'viewed' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn'

// 岗位信息
export interface Job {
  id: string
  title: string
  partnerId: string
  partnerName: string
  partnerLogo?: string
  // 基于岗位成果发布
  jobBrandId?: string
  jobBrandName?: string
  type: JobType
  workNature: WorkNature
  department: string
  location: string
  salaryMin?: number
  salaryMax?: number
  salaryUnit: 'month' | 'day' | 'hour'
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  education: string
  experience: string
  headcount: number
  suitableMajors: string[]
  skills: string[]
  description: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  status: JobStatus
  isUrgent: boolean
  isRecommended: boolean
  viewCount: number
  applicationCount: number
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

// 岗位推荐记录
export interface JobRecommendation {
  id: string
  jobId: string
  jobTitle: string
  partnerId: string
  partnerName: string
  studentId: string
  studentName: string
  studentMajor: string
  matchScore: number // 匹配度 0-100
  matchReasons: string[] // 匹配原因标签
  batchNo: string // 推荐批次号
  status: 'pending' | 'viewed' | 'contacted' | 'hired' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// 学生信息（简化版）
export interface StudentProfile {
  id: string
  name: string
  gender: 'male' | 'female'
  avatar?: string
  major: string
  department: string
  grade: string
  studentId: string
  phone: string
  email: string
  expectedSalary?: string
  expectedLocation?: string
  skills: string[]
  certificates: string[]
  internshipExperience?: string
  selfIntroduction?: string
  resumeUrl?: string
  status: 'seeking' | 'employed' | 'not-seeking'
  createdAt: Date
  updatedAt: Date
}

// 岗位投递
export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  partnerId: string
  partnerName: string
  studentId: string
  studentName: string
  studentMajor: string
  studentPhone: string
  studentEmail: string
  resumeUrl?: string
  coverLetter?: string
  status: ApplicationStatus
  feedback?: string
  interviewTime?: Date
  interviewLocation?: string
  interviewNotes?: string
  offerSalary?: number
  hiredDate?: Date
  appliedAt: Date
  updatedAt: Date
}

// 岗位收藏
export interface JobFavorite {
  id: string
  jobId: string
  studentId: string
  createdAt: Date
}

// 就业统计
export interface EmploymentStats {
  totalJobs: number
  activeJobs: number
  totalRecommendations: number
  pendingRecommendations: number
  contactedCount: number
  hiredCount: number
  jobsByType: Record<JobType, number>
  recommendationsByStatus: Record<string, number>
  topPartners: { partnerId: string; partnerName: string; jobCount: number }[]
  topMajors: { major: string; recommendationCount: number }[]
}

// 岗位状态标签
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: '草稿',
  published: '招聘中',
  paused: '暂停招聘',
  closed: '已关闭',
  filled: '已招满',
}

// 岗位类型标签
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': '全职',
  'part-time': '兼职',
  internship: '实习',
  apprentice: '学徒',
}

// 工作性质标签
export const WORK_NATURE_LABELS: Record<WorkNature, string> = {
  'on-site': '现场办公',
  remote: '远程办公',
  hybrid: '混合办公',
}

// 投递状态标签
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: '待查看',
  viewed: '已查看',
  interview: '面试中',
  offer: '已发offer',
  hired: '已录用',
  rejected: '未通过',
  withdrawn: '已撤回',
}

// 学历要求
export const EDUCATION_LEVELS = [
  '不限',
  '中专/中技',
  '高中',
  '大专',
  '本科',
  '硕士',
  '博士',
]

// 经验要求
export const EXPERIENCE_LEVELS = [
  '不限',
  '在校生',
  '应届生',
  '1年以下',
  '1-3年',
  '3-5年',
  '5年以上',
]

// 就业项目类型
export type EmploymentProjectType = 'spring' | 'autumn' | '定向招聘' | '专场招聘'

// 就业项目状态
export type EmploymentProjectStatus = 'preparing' | 'ongoing' | 'ended'

// 就业项目
export interface EmploymentProject {
  id: string
  name: string
  type: EmploymentProjectType
  season: string
  partnerIds: string[]
  targetStudents: string
  startDate: Date
  endDate: Date
  status: EmploymentProjectStatus
  jobCount: number
  applicationCount: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export const EMPLOYMENT_PROJECT_TYPE_LABELS: Record<EmploymentProjectType, string> = {
  spring: '春季招聘',
  autumn: '秋季招聘',
  '定向招聘': '定向招聘',
  '专场招聘': '专场招聘',
}

export const EMPLOYMENT_PROJECT_STATUS_LABELS: Record<EmploymentProjectStatus, string> = {
  preparing: '筹备中',
  ongoing: '进行中',
  ended: '已结束',
}
