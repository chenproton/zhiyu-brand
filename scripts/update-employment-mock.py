import re
import random

random.seed(42)

with open('lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract jobBrands to use for mapping
job_brand_pattern = r'export const jobBrands: JobBrand\[\] = \[(.*?)\]\n\n// 专业品牌'
jb_match = re.search(job_brand_pattern, content, re.DOTALL)
job_brands = []
if jb_match:
    jb_content = jb_match.group(1)
    for m in re.finditer(r'id:\s*"(jb\d+)".*?name:\s*"([^"]+)"', jb_content, re.DOTALL):
        job_brands.append({"id": m.group(1), "name": m.group(2)})

print(f"Found {len(job_brands)} job brands")

# 2. Extract studentProfiles
student_pattern = r'export const studentProfiles: StudentProfile\[\] = \[(.*?)\]\n\n// 岗位投递'
st_match = re.search(student_pattern, content, re.DOTALL)
students = []
if st_match:
    st_content = st_match.group(1)
    for m in re.finditer(r'id:\s*"(stu\d+)".*?name:\s*"([^"]+)".*?major:\s*"([^"]+)"', st_content, re.DOTALL):
        students.append({"id": m.group(1), "name": m.group(2), "major": m.group(3)})

print(f"Found {len(students)} students")

# 3. Extract jobs to build recommendations
job_pattern = r'export const jobs: Job\[\] = \[(.*?)\]\n\n// 学生信息'
job_match = re.search(job_pattern, content, re.DOTALL)
jobs = []
if job_match:
    job_content = job_match.group(1)
    for m in re.finditer(r'id:\s*"(j\d+)".*?title:\s*"([^"]+)".*?partnerId:\s*"([^"]+)".*?partnerName:\s*"([^"]+)".*?status:\s*"(\w+)".*?suitableMajors:\s*\[(.*?)\]', job_content, re.DOTALL):
        major_str = m.group(6)
        majors = re.findall(r'"([^"]+)"', major_str)
        jobs.append({
            "id": m.group(1),
            "title": m.group(2),
            "partnerId": m.group(3),
            "partnerName": m.group(4),
            "status": m.group(5),
            "majors": majors
        })

print(f"Found {len(jobs)} jobs")

# 4. Add jobBrandId and jobBrandName to each job
# We'll cycle through jobBrands
for i, job in enumerate(jobs):
    jb = job_brands[i % len(job_brands)]
    job["jobBrandId"] = jb["id"]
    job["jobBrandName"] = jb["name"]

# Replace each job in content
for job in jobs:
    old_job_start = f'id: "{job["id"]}"'
    # Find the job block and add jobBrandId after partnerLogo line
    pattern = rf'(id: "{job["id"]}".*?partnerLogo.*?\n)'
    replacement = rf'\1  jobBrandId: "{job["jobBrandId"]}",\n  jobBrandName: "{job["jobBrandName"]}",\n'
    content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)

print("Added jobBrandId to all jobs")

# 5. Generate jobRecommendations
recommendations = []
match_reasons_pool = [
    "专业对口", "技能匹配", "薪资期望匹配", "地点匹配",
    "实习经验丰富", "证书齐全", "成绩优异", "项目经验丰富",
    "双师型培养", "校企合作背景"
]

batch_counter = 1
for job in jobs:
    if job["status"] == "draft":
        continue
    # Find matching students (major match or random)
    matched = []
    for st in students:
        if st["major"] in job["majors"]:
            matched.append(st)
    # If no major match, pick random students
    if len(matched) == 0:
        matched = random.sample(students, k=min(3, len(students)))
    # Limit to 2-5 recommendations per job
    rec_count = min(random.randint(2, 5), len(matched))
    selected = random.sample(matched, k=rec_count)
    
    for st in selected:
        score = random.randint(65, 98)
        reasons = random.sample(match_reasons_pool, k=random.randint(2, 4))
        status = random.choice(['pending', 'pending', 'pending', 'viewed', 'contacted'])
        rec_id = f"rec{batch_counter:04d}"
        batch_no = f"BATCH-{batch_counter // 10 + 1:03d}"
        recommendations.append({
            "id": rec_id,
            "jobId": job["id"],
            "jobTitle": job["title"],
            "partnerId": job["partnerId"],
            "partnerName": job["partnerName"],
            "studentId": st["id"],
            "studentName": st["name"],
            "studentMajor": st["major"],
            "matchScore": score,
            "matchReasons": reasons,
            "batchNo": batch_no,
            "status": status,
            "createdAt": f"new Date('2024-{random.randint(1,6):02d}-{random.randint(1,28):02d}')",
            "updatedAt": f"new Date('2024-06-{random.randint(1,28):02d}')",
        })
        batch_counter += 1

print(f"Generated {len(recommendations)} recommendations")

# Build recommendation TS array
rec_lines = ["// 岗位推荐记录\nexport const jobRecommendations: JobRecommendation[] = ["]
for r in recommendations:
    reasons_str = ", ".join([f'"{reason}"' for reason in r["matchReasons"]])
    rec_lines.append(f"""{{
  id: "{r['id']}",
  jobId: "{r['jobId']}",
  jobTitle: "{r['jobTitle']}",
  partnerId: "{r['partnerId']}",
  partnerName: "{r['partnerName']}",
  studentId: "{r['studentId']}",
  studentName: "{r['studentName']}",
  studentMajor: "{r['studentMajor']}",
  matchScore: {r['matchScore']},
  matchReasons: [{reasons_str}],
  batchNo: "{r['batchNo']}",
  status: "{r['status']}",
  createdAt: {r['createdAt']},
  updatedAt: {r['updatedAt']},
}},""")
rec_lines.append("]\n")
rec_ts = "\n".join(rec_lines)

# Insert recommendations before employmentStats
content = content.replace(
    "// 就业统计\nexport const employmentStats: EmploymentStats",
    rec_ts + "\n// 就业统计\nexport const employmentStats: EmploymentStats"
)

print("Inserted jobRecommendations")

# 6. Update employmentStats
status_counts = {"pending": 0, "viewed": 0, "contacted": 0, "hired": 0, "rejected": 0}
for r in recommendations:
    status_counts[r["status"]] += 1

# Count hired from recommendations (simulate some hired)
status_counts["hired"] = len([r for r in recommendations if r["matchScore"] > 90]) // 3
status_counts["rejected"] = len([r for r in recommendations if r["matchScore"] < 75]) // 2

# Calculate top majors by recommendation count
major_counts = {}
for r in recommendations:
    major_counts[r["studentMajor"]] = major_counts.get(r["studentMajor"], 0) + 1
top_majors = sorted(major_counts.items(), key=lambda x: x[1], reverse=True)[:3]

new_stats = f"""// 就业统计
export const employmentStats: EmploymentStats = {{
  totalJobs: {len(jobs)},
  activeJobs: {len([j for j in jobs if j.get('status') == 'published'])},
  totalRecommendations: {len(recommendations)},
  pendingRecommendations: {status_counts['pending']},
  contactedCount: {status_counts['contacted']},
  hiredCount: {status_counts['hired']},
  jobsByType: {{ 'full-time': {len([j for j in jobs if j.get('type') == 'full-time'])}, 'part-time': {len([j for j in jobs if j.get('type') == 'part-time'])}, internship: {len([j for j in jobs if j.get('type') == 'internship'])}, apprentice: {len([j for j in jobs if j.get('type') == 'apprentice'])} }},
  recommendationsByStatus: {{
    pending: {status_counts['pending']},
    viewed: {status_counts['viewed']},
    contacted: {status_counts['contacted']},
    hired: {status_counts['hired']},
    rejected: {status_counts['rejected']},
  }},
  topPartners: [
    {{ partnerId: 'e001', partnerName: '苏州智联科技有限公司', jobCount: {len([j for j in jobs if j.get('partnerId') == 'e001'])} }},
    {{ partnerId: 'e002', partnerName: '江苏新能源集团', jobCount: {len([j for j in jobs if j.get('partnerId') == 'e002'])} }},
    {{ partnerId: 'e003', partnerName: '华东职院智能制造产业学院', jobCount: {len([j for j in jobs if j.get('partnerId') == 'e003'])} }},
  ],
  topMajors: [
"""
for major, count in top_majors:
    new_stats += f"    {{ major: '{major}', recommendationCount: {count} }},\n"
if len(top_majors) < 3:
    new_stats += "    { major: '人工智能应用技术', recommendationCount: 0 },\n"
new_stats += """  ],
}
"""

# Replace old employmentStats
old_stats_pattern = r'// 就业统计\nexport const employmentStats: EmploymentStats = \{.*?\}\n'
content = re.sub(old_stats_pattern, new_stats, content, count=1, flags=re.DOTALL)

print("Updated employmentStats")

# 7. Add helper function for recommendations
helper_pattern = r"(export function getEmploymentProjectById\(id: string\): EmploymentProject \| undefined \{\n  return employmentProjects\.find\(e => e\.id === id\)\n\})"
replacement = r"""\1

export function getRecommendationsByJobId(jobId: string): JobRecommendation[] {
  return jobRecommendations.filter(r => r.jobId === jobId)
}

export function getRecommendationsByStudentId(studentId: string): JobRecommendation[] {
  return jobRecommendations.filter(r => r.studentId === studentId)
}

export function getRecommendationById(id: string): JobRecommendation | undefined {
  return jobRecommendations.find(r => r.id === id)
}"""
content = re.sub(helper_pattern, replacement, content)

print("Added helper functions")

# 8. Update import in mock-data.ts to include JobRecommendation
old_import = """import type {
  Partner,
  Enterprise,
  PermissionGrant,
  CooperationAccount,
  Agreement,
  Project,
  Expert,
  Activity,
  Achievement,
  SchoolInfo,
  Registration,
  DashboardStats,
  TalentProfile,
  EmploymentCase,
  JobBrand,
  MajorBrand,
  TeacherBrand,
  CultureBrand,
  BrandTopic,
  Job,
  StudentProfile,
  JobApplication,
  EmploymentProject,
  EmploymentStats,
} from './types'"""

new_import = """import type {
  Partner,
  Enterprise,
  PermissionGrant,
  CooperationAccount,
  Agreement,
  Project,
  Expert,
  Activity,
  Achievement,
  SchoolInfo,
  Registration,
  DashboardStats,
  TalentProfile,
  EmploymentCase,
  JobBrand,
  MajorBrand,
  TeacherBrand,
  CultureBrand,
  BrandTopic,
  Job,
  StudentProfile,
  JobApplication,
  EmploymentProject,
  EmploymentStats,
  JobRecommendation,
} from './types'"""

content = content.replace(old_import, new_import)

print("Updated imports")

with open('lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Saved mock-data.ts")
