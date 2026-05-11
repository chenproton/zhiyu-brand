import re

with open('lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

project_data = {
    'proj002': {
        'supportingResults': [
            { 'id': 'sr003', 'name': '视觉检测算法库', 'type': '技术成果', 'description': '包含5种核心检测算法的代码库和技术文档', 'createdAt': "new Date('2024-03-15')" },
            { 'id': 'sr004', 'name': '检测系统原型', 'type': '场景成果', 'description': '基于深度学习的工业视觉检测系统原型及测试报告', 'createdAt': "new Date('2024-06-20')" },
            { 'id': 'sr005', 'name': '专利申请材料', 'type': '知识产权', 'description': '2项发明专利的申请文件和技术交底书', 'createdAt': "new Date('2024-08-10')" },
        ],
        'projectAgreements': [
            { 'id': 'pa002', 'name': '技术研发合作协议', 'type': '产学研协议', 'startDate': "new Date('2023-06-01')", 'endDate': "new Date('2025-05-31')", 'status': 'active', 'content': '联合开展工业视觉检测技术研发，共享知识产权', 'createdAt': "new Date('2023-05-15')" },
            { 'id': 'pa003', 'name': '设备共享补充协议', 'type': '补充协议', 'startDate': "new Date('2024-01-01')", 'endDate': "new Date('2025-05-31')", 'status': 'active', 'content': '企业提供GPU服务器和工业相机用于算法训练', 'createdAt': "new Date('2023-12-20')" },
        ],
        'phases': [
            { 'id': 'ph005', 'name': '调研阶段', 'description': '完成技术路线调研和需求分析', 'startDate': "new Date('2023-06-01')", 'endDate': "new Date('2023-08-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph006', 'name': '算法开发', 'description': '完成核心算法开发和单元测试', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2024-06-30')", 'status': 'in-progress', 'progress': 70 },
            { 'id': 'ph007', 'name': '系统集成', 'description': '完成检测系统与现有产线集成', 'startDate': "new Date('2024-07-01')", 'endDate': "new Date('2024-12-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph008', 'name': '试点应用', 'description': '在合作企业产线试点运行', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-05-31')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj003': {
        'supportingResults': [
            { 'id': 'sr006', 'name': '新能源实训课程体系', 'type': '课程成果', 'description': '包含光伏、风电、储能3个方向的实训课程', 'createdAt': "new Date('2023-06-10')" },
            { 'id': 'sr007', 'name': '双师培养方案', 'type': '师资成果', 'description': '校企双导师制培养模式和实施指南', 'createdAt': "new Date('2023-09-15')" },
            { 'id': 'sr008', 'name': '实训设备操作手册', 'type': '教学资源', 'description': '全套实训设备的操作规范和安全手册', 'createdAt': "new Date('2024-01-20')" },
        ],
        'projectAgreements': [
            { 'id': 'pa004', 'name': '实训基地共建协议', 'type': '基地建设协议', 'startDate': "new Date('2022-09-01')", 'endDate': "new Date('2025-08-31')", 'status': 'active', 'content': '共建新能源技术校外实训基地，企业投入设备和场地', 'createdAt': "new Date('2022-08-10')" },
        ],
        'phases': [
            { 'id': 'ph009', 'name': '方案设计', 'description': '完成基地建设方案设计', 'startDate': "new Date('2022-09-01')", 'endDate': "new Date('2022-10-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph010', 'name': '设备采购', 'description': '完成实训设备采购和验收', 'startDate': "new Date('2022-11-01')", 'endDate': "new Date('2023-03-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph011', 'name': '基地建设', 'description': '完成基地装修和设备安装调试', 'startDate': "new Date('2023-04-01')", 'endDate': "new Date('2023-12-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph012', 'name': '验收运行', 'description': '完成基地验收并投入教学运行', 'startDate': "new Date('2024-01-01')", 'endDate': "new Date('2024-08-31')", 'status': 'in-progress', 'progress': 80 },
        ]
    },
    'proj004': {
        'supportingResults': [
            { 'id': 'sr009', 'name': '竞赛规程和评分标准', 'type': '制度成果', 'description': 'AI技能竞赛的竞赛规程、评分标准和操作手册', 'createdAt': "new Date('2023-10-01')" },
            { 'id': 'sr010', 'name': '竞赛题库', 'type': '教学资源', 'description': '覆盖理论和实操的竞赛题库，共500+题目', 'createdAt': "new Date('2023-11-15')" },
            { 'id': 'sr011', 'name': '获奖作品集', 'type': '学生成果', 'description': '优秀作品汇编和案例展示视频', 'createdAt': "new Date('2024-03-10')" },
        ],
        'projectAgreements': [
            { 'id': 'pa005', 'name': '技能竞赛合作协议', 'type': '竞赛协议', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2024-03-31')", 'status': 'active', 'content': '联合举办AI技能竞赛，共同制定竞赛标准和评审规则', 'createdAt': "new Date('2023-08-20')" },
            { 'id': 'pa006', 'name': '赞助协议', 'type': '赞助协议', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2024-03-31')", 'status': 'active', 'content': '企业提供竞赛奖金和奖品赞助', 'createdAt': "new Date('2023-08-25')" },
        ],
        'phases': [
            { 'id': 'ph013', 'name': '竞赛策划', 'description': '完成竞赛方案策划和宣传推广', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2023-10-15')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph014', 'name': '报名组织', 'description': '完成参赛队伍报名和资格审核', 'startDate': "new Date('2023-10-16')", 'endDate': "new Date('2023-11-30')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph015', 'name': '竞赛实施', 'description': '完成竞赛举办和评审工作', 'startDate': "new Date('2023-12-01')", 'endDate': "new Date('2024-01-15')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph016', 'name': '成果总结', 'description': '完成竞赛总结和成果宣传', 'startDate': "new Date('2024-01-16')", 'endDate': "new Date('2024-03-31')", 'status': 'completed', 'progress': 100 },
        ]
    },
    'proj005': {
        'supportingResults': [
            { 'id': 'sr012', 'name': '孵化平台运营手册', 'type': '管理成果', 'description': '大学生创业孵化平台的运营管理制度和流程手册', 'createdAt': "new Date('2024-04-01')" },
            { 'id': 'sr013', 'name': '创业项目库', 'type': '项目成果', 'description': '入驻孵化平台的创业项目档案和成长跟踪记录', 'createdAt': "new Date('2024-06-15')" },
            { 'id': 'sr014', 'name': '创业导师资源库', 'type': '师资成果', 'description': '创业导师信息库和辅导案例集', 'createdAt': "new Date('2024-08-01')" },
        ],
        'projectAgreements': [
            { 'id': 'pa007', 'name': '创新创业孵化协议', 'type': '孵化协议', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2026-08-31')", 'status': 'active', 'content': '共建大学生创新创业孵化平台，提供场地、资金、导师支持', 'createdAt': "new Date('2023-08-15')" },
            { 'id': 'pa008', 'name': '场地使用协议', 'type': '场地协议', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2026-08-31')", 'status': 'active', 'content': '产业园提供500平米孵化场地，免租3年', 'createdAt': "new Date('2023-08-20')" },
        ],
        'phases': [
            { 'id': 'ph017', 'name': '平台搭建', 'description': '完成孵化平台建设和制度建立', 'startDate': "new Date('2023-09-01')", 'endDate': "new Date('2024-03-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph018', 'name': '项目入驻', 'description': '首批创业项目入驻和启动孵化', 'startDate': "new Date('2024-04-01')", 'endDate': "new Date('2024-09-30')", 'status': 'in-progress', 'progress': 60 },
            { 'id': 'ph019', 'name': '孵化培育', 'description': '开展项目孵化培育和成长加速', 'startDate': "new Date('2024-10-01')", 'endDate': "new Date('2025-09-30')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph020', 'name': '成果转化', 'description': '推动优秀项目注册公司和市场化', 'startDate': "new Date('2025-10-01')", 'endDate': "new Date('2026-08-31')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj006': {
        'supportingResults': [
            { 'id': 'sr015', 'name': '生物医药检测课程包', 'type': '课程成果', 'description': '包含HPLC、GC-MS等检测技术的5门实训课程', 'createdAt': "new Date('2024-06-01')" },
            { 'id': 'sr016', 'name': '检测标准操作程序', 'type': '标准成果', 'description': '药物检测的标准操作程序(SOP)和质量控制规范', 'createdAt': "new Date('2024-07-15')" },
            { 'id': 'sr017', 'name': '检测项目库', 'type': '教学资源', 'description': '覆盖常见药物检测项目的实训案例库', 'createdAt': "new Date('2024-09-01')" },
        ],
        'projectAgreements': [
            { 'id': 'pa009', 'name': '实训基地共建协议', 'type': '基地建设协议', 'startDate': "new Date('2024-04-01')", 'endDate': "new Date('2027-03-31')", 'status': 'active', 'content': '共建生物医药检测技术实训基地，企业提供检测设备和技术支持', 'createdAt': "new Date('2024-03-15')" },
        ],
        'phases': [
            { 'id': 'ph021', 'name': '设备采购', 'description': '完成检测设备和耗材采购', 'startDate': "new Date('2024-04-01')", 'endDate': "new Date('2024-08-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph022', 'name': '场地装修', 'description': '完成实验室装修和安全验收', 'startDate': "new Date('2024-09-01')", 'endDate': "new Date('2024-10-31')", 'status': 'in-progress', 'progress': 50 },
            { 'id': 'ph023', 'name': '课程开发', 'description': '完成实训课程开发和师资培训', 'startDate': "new Date('2024-11-01')", 'endDate': "new Date('2025-03-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph024', 'name': '试运营', 'description': '基地投入试运营和持续改进', 'startDate': "new Date('2025-04-01')", 'endDate': "new Date('2025-09-30')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj007': {
        'supportingResults': [
            { 'id': 'sr018', 'name': '直播运营课程包', 'type': '课程成果', 'description': '包含直播策划、短视频制作、数据分析的3门核心课程', 'createdAt': "new Date('2024-10-01')" },
            { 'id': 'sr019', 'name': '电商实训平台', 'type': '场景成果', 'description': '模拟电商直播环境的在线实训平台', 'createdAt': "new Date('2024-11-15')" },
        ],
        'projectAgreements': [
            { 'id': 'pa010', 'name': '电商人才培养协议', 'type': '人才培养协议', 'startDate': "new Date('2024-09-01')", 'endDate': "new Date('2026-06-30')", 'status': 'active', 'content': '联合培养电商直播运营人才，企业提供实战项目和导师', 'createdAt': "new Date('2024-08-01')" },
        ],
        'phases': [
            { 'id': 'ph025', 'name': '需求调研', 'description': '完成电商行业人才需求调研', 'startDate': "new Date('2024-09-01')", 'endDate': "new Date('2024-10-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph026', 'name': '方案制定', 'description': '完成人才培养方案制定', 'startDate': "new Date('2024-11-01')", 'endDate': "new Date('2024-12-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph027', 'name': '课程开发', 'description': '完成核心课程开发和平台建设', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-06-30')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph028', 'name': '试点实施', 'description': '开展试点运行和持续改进', 'startDate': "new Date('2025-07-01')", 'endDate': "new Date('2026-06-30')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj008': {
        'supportingResults': [
            { 'id': 'sr020', 'name': '定向培养课程体系', 'type': '课程成果', 'description': '针对软件企业需求定制的5个课程模块', 'createdAt': "new Date('2024-07-01')" },
            { 'id': 'sr021', 'name': '企业项目案例库', 'type': '教学资源', 'description': '来自园区企业的真实软件开发项目案例', 'createdAt': "new Date('2024-08-15')" },
            { 'id': 'sr022', 'name': '双师教学指南', 'type': '师资成果', 'description': '校企双师协同教学的实施指南和评价标准', 'createdAt': "new Date('2024-09-20')" },
        ],
        'projectAgreements': [
            { 'id': 'pa011', 'name': '软件人才定向培养协议', 'type': '定向培养协议', 'startDate': "new Date('2024-06-01')", 'endDate': "new Date('2027-05-31')", 'status': 'active', 'content': '采用2+1校企联合培养模式，园区企业提供实习和就业岗位', 'createdAt': "new Date('2024-05-15')" },
            { 'id': 'pa012', 'name': '实习岗位保障协议', 'type': '实习协议', 'startDate': "new Date('2024-06-01')", 'endDate': "new Date('2027-05-31')", 'status': 'active', 'content': '每年提供不少于200个实习岗位', 'createdAt': "new Date('2024-05-20')" },
        ],
        'phases': [
            { 'id': 'ph029', 'name': '企业调研', 'description': '完成园区企业人才需求调研', 'startDate': "new Date('2024-06-01')", 'endDate': "new Date('2024-07-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph030', 'name': '课程定制', 'description': '完成定向培养课程定制', 'startDate': "new Date('2024-08-01')", 'endDate': "new Date('2024-10-31')", 'status': 'in-progress', 'progress': 40 },
            { 'id': 'ph031', 'name': '双师组建', 'description': '组建校企双师教学团队', 'startDate': "new Date('2024-11-01')", 'endDate': "new Date('2024-12-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph032', 'name': '试点实施', 'description': '开展定向培养试点', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-05-31')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj009': {
        'supportingResults': [
            { 'id': 'sr023', 'name': '文创产品设计手册', 'type': '设计成果', 'description': '具有地方特色的文创产品设计规范和案例集', 'createdAt': "new Date('2024-11-01')" },
            { 'id': 'sr024', 'name': '品牌策划方案', 'type': '策划成果', 'description': '文创产品品牌定位和市场推广策划方案', 'createdAt': "new Date('2025-01-15')" },
        ],
        'projectAgreements': [
            { 'id': 'pa013', 'name': '文创产品开发协议', 'type': '产品开发协议', 'startDate': "new Date('2024-10-01')", 'endDate': "new Date('2025-09-30')", 'status': 'active', 'content': '联合开发具有地方特色的文创产品', 'createdAt': "new Date('2024-09-01')" },
        ],
        'phases': [
            { 'id': 'ph033', 'name': '市场调研', 'description': '完成文创市场调研', 'startDate': "new Date('2024-10-01')", 'endDate': "new Date('2024-11-30')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph034', 'name': '产品设计', 'description': '完成文创产品设计', 'startDate': "new Date('2024-12-01')", 'endDate': "new Date('2025-03-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph035', 'name': '产品孵化', 'description': '完成产品打样和市场测试', 'startDate': "new Date('2025-04-01')", 'endDate': "new Date('2025-07-31')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj010': {
        'supportingResults': [
            { 'id': 'sr025', 'name': '现代服务培训课程包', 'type': '课程成果', 'description': '面向现代服务类专业教师的6门培训课程', 'createdAt': "new Date('2024-09-01')" },
            { 'id': 'sr026', 'name': '培训师资库', 'type': '师资成果', 'description': '企业专家和学校骨干教师组成的培训师资库', 'createdAt': "new Date('2024-10-15')" },
            { 'id': 'sr027', 'name': '培训案例集', 'type': '教学资源', 'description': '产业前沿知识和教学方法改革的培训案例', 'createdAt': "new Date('2024-12-01')" },
        ],
        'projectAgreements': [
            { 'id': 'pa014', 'name': '师资培训合作协议', 'type': '培训协议', 'startDate': "new Date('2024-07-01')", 'endDate': "new Date('2025-06-30')", 'status': 'active', 'content': '面向现代服务类专业教师开展产业前沿知识培训', 'createdAt': "new Date('2024-06-15')" },
        ],
        'phases': [
            { 'id': 'ph036', 'name': '培训设计', 'description': '完成培训课程体系设计', 'startDate': "new Date('2024-07-01')", 'endDate': "new Date('2024-08-31')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph037', 'name': '首期培训', 'description': '完成首期教师培训', 'startDate': "new Date('2024-09-01')", 'endDate': "new Date('2024-12-31')", 'status': 'in-progress', 'progress': 55 },
            { 'id': 'ph038', 'name': '成果总结', 'description': '完成培训成果总结', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-06-30')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj011': {
        'supportingResults': [
            { 'id': 'sr028', 'name': '视觉引导系统方案', 'type': '技术成果', 'description': '工业机器人视觉引导系统的整体技术方案', 'createdAt': "new Date('2025-01-01')" },
            { 'id': 'sr029', 'name': '精密定位算法', 'type': '算法成果', 'description': '解决精密装配定位难题的核心算法', 'createdAt': "new Date('2025-04-01')" },
        ],
        'projectAgreements': [
            { 'id': 'pa015', 'name': '技术攻关合作协议', 'type': '产学研协议', 'startDate': "new Date('2024-11-01')", 'endDate': "new Date('2026-10-31')", 'status': 'active', 'content': '联合开展工业机器人视觉引导系统技术攻关', 'createdAt': "new Date('2024-10-01')" },
        ],
        'phases': [
            { 'id': 'ph039', 'name': '需求分析', 'description': '完成技术需求分析', 'startDate': "new Date('2024-11-01')", 'endDate': "new Date('2024-12-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph040', 'name': '方案设计', 'description': '完成系统方案设计', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-03-31')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph041', 'name': '原型开发', 'description': '完成系统原型开发', 'startDate': "new Date('2025-04-01')", 'endDate': "new Date('2025-09-30')", 'status': 'pending', 'progress': 0 },
            { 'id': 'ph042', 'name': '现场测试', 'description': '完成现场应用测试', 'startDate': "new Date('2025-10-01')", 'endDate': "new Date('2026-04-30')", 'status': 'pending', 'progress': 0 },
        ]
    },
    'proj012': {
        'supportingResults': [
            { 'id': 'sr030', 'name': 'AI科普课程包', 'type': '课程成果', 'description': '面向中小学生的3门AI科普课程', 'createdAt': "new Date('2024-09-01')" },
            { 'id': 'sr031', 'name': '科普活动手册', 'type': '活动成果', 'description': '社区科普活动的组织手册和互动方案', 'createdAt': "new Date('2024-10-15')" },
            { 'id': 'sr032', 'name': '科普视频系列', 'type': '媒体成果', 'description': 'AI科普短视频系列，共10集', 'createdAt': "new Date('2024-11-20')" },
        ],
        'projectAgreements': [
            { 'id': 'pa016', 'name': '科普服务协议', 'type': '服务协议', 'startDate': "new Date('2024-08-01')", 'endDate': "new Date('2025-07-31')", 'status': 'active', 'content': '面向社区居民和中小学生开展AI科普讲座和体验活动', 'createdAt': "new Date('2024-07-15')" },
            { 'id': 'pa017', 'name': '社区合作备忘录', 'type': '合作备忘录', 'startDate': "new Date('2024-08-01')", 'endDate': "new Date('2025-07-31')", 'status': 'active', 'content': '与10个社区建立科普活动合作关系', 'createdAt': "new Date('2024-07-20')" },
        ],
        'phases': [
            { 'id': 'ph043', 'name': '课程开发', 'description': '完成科普课程开发', 'startDate': "new Date('2024-08-01')", 'endDate': "new Date('2024-09-30')", 'status': 'completed', 'progress': 100 },
            { 'id': 'ph044', 'name': '试点讲座', 'description': '完成3场试点讲座', 'startDate': "new Date('2024-10-01')", 'endDate': "new Date('2024-12-31')", 'status': 'in-progress', 'progress': 45 },
            { 'id': 'ph045', 'name': '全面推广', 'description': '覆盖10个社区开展讲座', 'startDate': "new Date('2025-01-01')", 'endDate': "new Date('2025-06-30')", 'status': 'pending', 'progress': 0 },
        ]
    },
}

def format_array(items, indent=4):
    lines = []
    for item in items:
        line = ' ' * indent + '{ '
        parts = []
        for k, v in item.items():
            if k == 'createdAt' or 'Date' in str(v):
                parts.append(f'{k}: {v}')
            elif isinstance(v, str):
                parts.append(f"{k}: '{v}'")
            elif isinstance(v, int):
                parts.append(f'{k}: {v}')
        line += ', '.join(parts) + ' },'
        lines.append(line)
    return '\n'.join(lines)

for proj_id, data in project_data.items():
    # Find the project block
    pattern = rf"(id: '{proj_id}',.*?)publishStatus: '(draft|published)',"
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f"Warning: Could not find {proj_id}")
        continue
    
    # Check if already has supportingResults
    if 'supportingResults:' in match.group(0):
        print(f"Skipping {proj_id} - already has data")
        continue
    
    # Build insert text
    insert_lines = []
    insert_lines.append('    supportingResults: [')
    insert_lines.append(format_array(data['supportingResults'], indent=6))
    insert_lines.append('    ],')
    insert_lines.append('    projectAgreements: [')
    insert_lines.append(format_array(data['projectAgreements'], indent=6))
    insert_lines.append('    ],')
    insert_lines.append('    phases: [')
    insert_lines.append(format_array(data['phases'], indent=6))
    insert_lines.append('    ],')
    insert_text = '\n'.join(insert_lines)
    
    # Insert after publishStatus line
    old_text = match.group(0)
    new_text = old_text + '\n' + insert_text
    content = content.replace(old_text, new_text, 1)
    print(f"Updated {proj_id}")

with open('lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
