考试包含 100 道选择题，考试时长 3 小时，及格线为 70%（即答对 70 题）

每道题1.8分钟，全英文



考试网站

[https://learn.eccouncil.org/your-portal/home?logged=true](https://learn.eccouncil.org/your-portal/home?logged=true)



官方练习网站

[https://cyberq.eccouncil.org/](https://cyberq.eccouncil.org/)



刷题网站

[https://www.freecram.com/EC-COUNCIL-certification/312-39-exam-questions.html](https://www.freecram.com/EC-COUNCIL-certification/312-39-exam-questions.html)

# 练习网站
[https://jiangren.com.au/certifications/exam/ec-312-39](https://jiangren.com.au/certifications/exam/ec-312-39)

1. edusum.com  
地址：edusum.com/ec-council/ec-council-csa-312-39-certification-sample-questions  
提供免费样题，题目贴近真实考试的类型和难度，并有付费题库（175+ 题，2个月无限练习）。社区驱动，质量较稳定，是口碑最好的模拟题平台之一。 EDUSUM
2. exams4sure.com  
地址：exams4sure.com/312-39-practice-questions.html  
提供免费练习题，每道题附有详细解析，解释答案背后的原因，帮助强化知识点，同时可以定位薄弱环节。 Exams4sure
3. validexamdumps.com  
地址：validexamdumps.com/eccouncil/312-39-exam-questions  
提供带详细解析的免费题目，每题附参考来源，2026年4月更新过。 ValidExamDumps
4. itexams.com  
地址：itexams.com/info/312-39  
定位为免费、持续维护的真题资源平台，题库更新至2026年4月







[https://hackmd.io/@9dCJrgb6QHGd8dRfgHO0zg/HkbfnI_cj](https://hackmd.io/@9dCJrgb6QHGd8dRfgHO0zg/HkbfnI_cj)







# EC-Council CSA (312-39) 常见知识点整理
## 一、SOC 基础（必考）
### SOC 职责
+ 监控安全事件
+ 告警分析（Alert Triage）
+ 事件响应（Incident Response）
+ 日志分析
+ 威胁狩猎（Threat Hunting）
+ 升级事件（Escalation）

### SOC 层级
+ L1：监控、初步分析
+ L2：深入调查、关联分析
+ L3：高级分析、威胁狩猎

---

## 二、网络基础（高频）
### OSI 七层
重点：

+ TCP / UDP
+ IP
+ HTTP / HTTPS
+ DNS
+ SMTP
+ FTP
+ SSH

### 常见端口（高频记忆）
| 服务 | 端口 |
| --- | --- |
| HTTP | 80 |
| HTTPS | 443 |
| DNS | 53 |
| SSH | 22 |
| FTP | 21 |
| RDP | 3389 |
| SMTP | 25 |
| POP3 | 110 |
| IMAP | 143 |
| SMB | 445 |


---

## 三、攻击类型（非常高频）
### DoS / DDoS
特征：

+ 流量异常
+ SYN Flood
+ ICMP Flood

### Phishing
特征：

+ 仿冒邮件
+ 可疑链接
+ 域名欺骗

### Malware
分类：

+ Trojan
+ Worm
+ Ransomware
+ Spyware
+ Rootkit

### Web 攻击
重点：

+ SQL Injection
+ XSS
+ CSRF
+ File Inclusion

---

## 四、日志分析（核心）
考试很喜欢给日志。

## Linux 日志位置
| 日志 | 路径 |
| --- | --- |
| auth | /var/log/auth.log |
| syslog | /var/log/syslog |
| secure | /var/log/secure |


### 常见 Linux 行为
+ sudo 提权
+ SSH 登录失败
+ brute force

---

## 五、Windows Event ID（超高频）
### 登录相关
| Event ID | 含义 |
| --- | --- |
| 4624 | 登录成功 |
| 4625 | 登录失败 |
| 4634 | 用户注销 |
| 4648 | 使用显式凭据 |


### 账户相关
| Event ID | 含义 |
| --- | --- |
| 4720 | 创建用户 |
| 4726 | 删除用户 |
| 4732 | 添加到组 |


### 安全相关
| Event ID | 含义 |
| --- | --- |
| 1102 | 日志被清除 |
| 7045 | 新服务安装 |
| 4688 | 新进程创建 |


很多题直接问：  
“哪个 Event ID 表示登录失败？”  
答案就是 4625。

---

## 六、SIEM（核心）
重点理解：

+ Log Aggregation
+ Correlation
+ Alerting
+ Dashboard
+ IOC 检测

### 常见 SIEM
+ Splunk
+ IBM QRadar
+ Microsoft Sentinel
+ ArcSight

### 常见 SIEM 题
例如：

+ 多次登录失败后成功
+ 同 IP 扫描多个端口
+ 异常流量峰值

本质都是 correlation rule。

---

## 七、IDS / IPS
### IDS
只检测，不阻断。

### IPS
可以阻断攻击。

### 类型
+ Network-based
+ Host-based

### 常见工具
+ Snort
+ Suricata

---

## 八、MITRE ATT&CK（近年高频）
攻击阶段：

| 阶段 | 示例 |
| --- | --- |
| Initial Access | Phishing |
| Execution | PowerShell |
| Persistence | Registry Run Key |
| Privilege Escalation | Token Abuse |
| Defense Evasion | Log Clearing |
| Exfiltration | FTP 上传 |


重点：  
考试会给行为让你判断属于哪个 tactic。

---

## 九、Kill Chain
顺序很重要：

1. Reconnaissance
2. Weaponization
3. Delivery
4. Exploitation
5. Installation
6. C2
7. Actions on Objectives

常考：  
“邮件附件木马属于哪个阶段？”  
通常是 Delivery。

---

## 十、Incident Response（必考）
流程：

1. Preparation
2. Identification
3. Containment
4. Eradication
5. Recovery
6. Lessons Learned

很多题考：  
“首先应该做什么？”

---

## 十一、IOC（Indicators of Compromise）
IOC 包括：

+ 恶意 IP
+ Hash
+ 域名
+ URL
+ Registry Key

Hash 类型：

+ MD5
+ SHA1
+ SHA256

---

## 十二、威胁情报（Threat Intelligence）
分类：

+ Strategic
+ Tactical
+ Operational
+ Technical

### STIX / TAXII
经常出现概念题。

---

## 十三、数字取证（基础）
重点：

+ Chain of Custody
+ Disk Imaging
+ Hash 验证

工具：

+ Autopsy
+ FTK Imager

---

# 高频“考试套路”
## 1. 先看问题再看日志
节省时间。

---

## 2. 找异常
例如：

+ 多次失败登录
+ 深夜登录
+ 国外 IP
+ 短时间大量请求

---

## 3. 注意关键词
| 关键词 | 方向 |
| --- | --- |
| SYN | Flood |
| PowerShell | Execution |
| EncodedCommand | 恶意脚本 |
| Base64 | Obfuscation |
| rundll32 | LOLBin |
| Mimikatz | Credential Dumping |






Event ID 要背

資安事件處理流程

角色職責定義

SOC 的架構

認識基本攻擊語法 ( XSS、SQL Injection 等)

各式 Log 保存的路徑

SIEM 的架構與運作流程

<!-- 这是一张图片，ocr 内容为：TEAM MEMBER ROLE SOC MANAGER THEY ARE RESPONSIBLE FOR MANAGING THE PERSONNEL AND BUDGET REQUIRED FOR SECURITY SOLUTIONS.THEY ALSO COORDINATE WITH THE LEGAL DEPARTMENT WHENEVER NEED.食香 理安全解决方案所需的人员和预算,满通该调舆管理SOC INCIDENT RESPONDER THESE PROFESSIONALS ARE THE FIRST ONES TO RESPOND TO ANY SECURITY INCIDENT.第一位封住 何安全事件做出馨魔的人 FORENSIC INVESTIGATOR THE SPECIALISTS TRAINED TO ANALYZE THE ATTACK BY GATHERING AND PRESERVING THE PIECES OF DIGITAL EVIDENCE.收集和保存整振来分析攻雕 THE EXPERTS MONITORING THE ACTIVITIES OF THE STAFF AND CHECK WHETHEY COMPLY COMPLIANCE AUDITOR WITH THE PRE-DEFINED PROCEDURES.监控员工的行高,亚被查他们是否符合程序 SOC ANALYST/ THESE MEMBERS ESCALATE THE POTENTIAL THREATS AFTER ANALYZING AND RANKING THEM ON THESEVERITYLEVEL.封威府殿重性进行分析并进行排名后,将其升级. SOC ANALYSES L1: RESPONSIBLE FOR MONITORING THE SECURITY ALERT FORM SIEM/ CREATES USE CASE AND TRIAGED ALERT(捡值分频,事件分频)/MA EMAIL ADDRESS AND DISTRIBUTION LIST, ANSWER SOC PHONE LINES AND UPDATE REQUIRED DOCUMENT SOC ANALYSES L2:INVESTIGATE(琵琶).VALIDATION(雅隆) AND PRITIZE(侵先序)/COLLECT AND DOCUMENT DATA RELATED TO SUSPICIOUS ACTIVITIES AND FORWARD IT TO THE NEXT LEVEL FOR INVESTIGATION / FOLLOW TICKET AND CLOSE FALSE POSITIVES -->
![](https://cdn.nlark.com/yuque/0/2026/png/2462850/1779908839932-1704902b-e2ca-4063-9805-7d08d2d6b2cd.png)

<font style="color:rgb(107, 107, 107);">筆記</font>

<font style="color:rgba(0, 0, 0, 0.8);">Press enter or click to view image in full size</font>

<!-- 这是一张图片，ocr 内容为：LOG COLLECTION OF INFORMATION/ DATA ON EVENTS 0  LOGGINGIS THE PROCESS OF RECORDING AND STORING LOGS OF THE EVENT OCCURIN THE NETWORK 口核起差悬差悬差已经是纪 和存储网络中发生的事件的日法的过程 EXAMPLE:TRAIL OFLOGIN FAILURE EVENTFOLLOWED BY LOGIN SUCCESSTUL EVENT 登差失取事件的轨莎!然后是登臻成 功事件的轨胁 EVENT EVENT IS AN OBSERVED CHANGE IN THE DAY-IO-DAY OPERATIONS OF A SYSTEM ,NETWORK PROCESS.WORKFLOW OR PER 事件是在系统,绸络,流程,工作流程或人员的日常操作中鹤察到的鬓化 TYPE OF LOG WITH SPECIFIC CONTEXT 具有特定上下文的日 EXAMPLE:LOGIN SUCCESSFULL AND FAILURE EVENT 登辣成功和失败事件/ACCOUNT LOCK OUT LOCK OUT 幅户锁定 INCIDENT EVENT CAN AFFECT THE SECURITY IT CAN BE GENERATED INTENTIONALLY OR UNINTENTIONALLY 可以是有意或无意或无意或无意的 EXAMPLE:BRUTE FORCE ATTACK,SYSTEM SHUTDOWN -->
![](https://cdn.nlark.com/yuque/0/2026/png/2462850/1779908839382-f48585c6-518a-459e-a759-af3c44495ebf.png)

<font style="color:rgba(0, 0, 0, 0.8);">Press enter or click to view image in full size</font>

<!-- 这是一张图片，ocr 内容为：LOCAL LOGGING:LINUX LOG LINUX LOG:R G:RECORD OF THE ACTIVITY OR EVENT MOST OF THE LINUX LOGS ARE LOCATED AT /VAR/LOG DIRECTORY (大部分) LINUX LOG FILE(HTTPS://WWW.EXABEAM.COM/SIEM-GUIDE/EVENTS-AND-LOGS/) /VAR/LOG/SYSLOG OR /VAR/LOG/MESSAGESSAGES-STORES ALL ACTIVITY DATA ACROSS THE LINUX SYSTEM. /VAR/LOG/AUTH.LOG OR /VAR/LOG/SECURE-STORES AUTHENTICATION LOGS /VAR/LOG/BOOT.LOG-MESSAGES LOGGED DURING STARTUP /VAR/LOG/MAILLOG OR VAR/LOG/MAIL.LOG-EVENTS RELATED TO EMAIL SERVERS /VAR/LOG/KERN-KERNEL LOGS /VAR/LOG/DMESG-DEVICE DRIVER LOGS /VAR/LOG/FAILLOG-FAILED LOGIN ATTEMPTS /VAR/LOG/CRON-EVENTS RELATED TO CRON JOBS OR THE CRON DAEMON /VAR/LOG/YUM.LOG-EVENTS RELATED TO INSTALLATION OF YUM PACKAGES /VAR/LOG/HTTPD/-HTTP ERRORS AND ACCESS LOQS CONTAINING ALL HTTP REQUESTS /VAR/LOG/MYSQLD.LOG OR /VAR/LOG/MYSQL.LOG-MYSQL LOG FILES LOG FORMAT -->
![](https://cdn.nlark.com/yuque/0/2026/png/2462850/1779908840822-3d0352d2-27c5-4262-a7da-37a9216e4930.png)

## 






# 四种 Threat Intelligence 区别（CSA 高频）
| 类型 | 面向对象 | 内容 |
| --- | --- | --- |
| Strategic | 高层管理者/CISO | 高层战略、风险趋势、业务影响 |
| Operational | SOC、IR Team、NOC | 攻击活动、攻击者意图、攻击计划 |
| Tactical | 防御团队 | TTPs（战术、技术、程序） |
| Technical | 安全设备 | IOC、IP、Hash、Domain |




#  Adaptive Security Appliance
属于：

+  企业级防火墙 
+  VPN 网关 
+  网络安全设备 

主要功能：

+  Firewall 
+  VPN 
+  IDS/IPS 
+  NAT 
+  Access Control 
+  Logging 
+  Threat Detection 



## Cisco ASA Severity 等级（CSA 高频）
Cisco ASA 日志格式中：

%ASA-severity-messageID

其中：

-5-

表示 Severity Level = 5。

| 等级 | 含义 |
| --- | --- |
| 0 | Emergency |
| 1 | Alert |
| 2 | Critical |
| 3 | Error |
| 4 | Warning |
| 5 | Notification |
| 6 | Informational |
| 7 | Debugging |


```plain
%ASA-4-106023: Deny tcp src outside:1.1.1.1/443
dst inside:10.0.0.5/3389
```

分析：

+  Severity 4 = Warning 
+  ACL 拒绝 
+  外部 IP 访问内网 RDP 
+  可能扫描或攻击行为





# macOS 中常见日志路径
| 路径 | 用途 |
| --- | --- |
| /private/var/log | 系统与安全日志 |
| /var/log | 指向 private/var/log |
| ~/Library/Logs | 用户应用日志 |
| /Library/Logs | 系统应用日志 |




# UEBA
Which of the following event detection techniques uses User and Entity Behavior Analytics (UEBA)?

A. Rule-based detection  规则

B. Heuristic-based detection 启发式

C. Anomaly-based detection 异常 ✅

D. Signature-based detection 签名









**<font style="color:rgb(48, 48, 48);">Asset-Enriched Risk Calculation:</font>**<font style="color:rgb(48, 48, 48);">Risk=Likelihood×Impact×Asset Value</font>  


**<font style="color:rgb(48, 48, 48);">OODA loop</font>**<font style="color:rgb(48, 48, 48);"> (Observe, Orient, Decide, and Act), the "Observe" phase is strictly about data collection, whereas the "Orient" phase is where that data is analyzed and prioritized.</font>

