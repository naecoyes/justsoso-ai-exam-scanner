# EC-Council CSA (312-39) 题库

> **加粗题号** = 曾做错的题目

---

## Question 1

The SOC team found a suspicious document file on a user's workstation. Upon initial inspection, the document appears benign, but deeper analysis reveals an embedded PowerShell script. The team suspects the script is designed to download and execute a malicious payload. They need to understand the script's functionality without triggering it. Which malware analysis technique is recommended to understand the PowerShell script's functionality without executing it?

**A.** Static analysis
**B.** Dynamic analysis
**C.** Automated behavioral analysis
**D.** Network traffic analysis

**Answer: A**

Static analysis is the correct approach when the requirement is to understand what the script is intended to do without executing it. For PowerShell embedded in documents, static analysis includes extracting the script content, de-obfuscating it (common techniques include base64 decoding, string reconstruction, and analyzing encoded commands), and reviewing functions, URLs/IPs, file paths, registry keys, and command-line arguments. Dynamic or behavioral analysis involves running code in a controlled sandbox, which violates the constraint "without triggering it." Network traffic analysis can help once execution has occurred but cannot fully explain logic that never ran.

---

## **Question 2** ❌

Daniel is a member of an IRT, which was started recently in a company named Mesh Tech. He wanted to find the purpose and scope of the planned incident response capabilities.
What is he looking for?

**A.** Incident Response Intelligence
**B.** Incident Response Mission
**C.** Incident Response Vision
**D.** Incident Response Resources

**Answer: B**

Daniel is seeking the **Incident Response Mission**, which outlines the purpose and scope of the incident response capabilities within his organization. The mission statement defines the primary objectives and the intended direction for the IRT, serving as a guiding principle for operations and aligning activities with the broader goals of the organization's security posture.

---

## Question 3

A type of threat intelligence that finds out information about the attacker by misleading them is known as:

**A.** Threat trending Intelligence
**B.** Detection Threat Intelligence
**C.** Operational Intelligence
**D.** Counter Intelligence

**Answer: D**

**Counter Intelligence** refers to efforts to deceive, manipulate, or mislead potential attackers to uncover their intentions, capabilities, or identities. This often involves setting up honeypots or traps to engage the attacker without them realizing they are being monitored.

---

## Question 4

A large web hosting service provider, Web4Everyone, hosts multiple major websites. You are a Level 1 SOC analyst investigating web server logs. To efficiently analyze logs and identify key details such as remote host, username, timestamp, requested resource, HTTP status code, and user-agent, which standardized log format will you choose?

**A.** JSON Format
**B.** Common Log Format (CLF)
**C.** Tab-Separated Format
**D.** Extended Log Format (ELF)

**Answer: D**

**Extended Log Format** includes additional fields beyond CLF baseline, such as referrer and user-agent—both critical for SOC investigations. CLF typically does not include user-agent by default. The scenario explicitly requires user-agent and fast parsing across common web fields.

---

## Question 5

Properly applied cyber threat intelligence to the SOC team helps them in discovering TTPs. What do these TTPs refer to?

**A.** Tactics, Techniques, and Procedures
**B.** Tactics, Threats, and Procedures
**C.** Targets, Threats, and Process
**D.** Tactics, Targets, and Process

**Answer: A**

**TTPs** = **Tactics** (overall strategy), **Techniques** (general methods), **Procedures** (specific detailed methods including tools, scripts, commands, and sequences of actions).

---

## Question 6

Mark Reynolds, a SOC analyst at a healthcare organization, detects a potential security threat: unusual login attempts targeting critical patient data servers. The threat has a "Likely" chance of occurring and could cause "Significant" damage. Using a standard Risk Matrix, how would this risk be categorized?

**A.** Medium
**B.** Low
**C.** High
**D.** Very High

**Answer: C**

In a standard risk matrix, "Likely" (high probability) + "Significant" (high impact) = **High** risk rating. "Very High" would typically require "Almost Certain" + "Severe/Catastrophic."

---

## Question 7

Which of the following attacks can be eradicated by disabling "allow_url_fopen and allow_url_include" in the php.ini file?

**A.** File Injection Attacks
**B.** URL Injection Attacks
**C.** LDAP Injection Attacks
**D.** Command Injection Attacks

**Answer: A**

Disabling `allow_url_fopen` and `allow_url_include` limits PHP's ability to open or include files only to local resources, significantly reducing the risk of **File Injection Attacks** (remote file inclusion vulnerabilities).

---

## Question 8

You are a SOC analyst at a financial institution developing a comprehensive threat model. Senior management is concerned about long-term financial and reputational damage. You need intelligence providing insights into high-level risks, geopolitical threats, and emerging cybercriminal strategies with long-term implications. Which type of threat intelligence are you seeking?

**A.** Strategic threat intelligence
**B.** Technical threat intelligence
**C.** Tactical threat intelligence
**D.** Operational threat intelligence

**Answer: A**

**Strategic threat intelligence** focuses on high-level risk trends, geopolitical drivers, adversary motivations, and emerging threat landscapes that influence long-term security posture and investment priorities. The emphasis on "senior management concerns" and "long-term implications" are hallmarks of strategic intelligence.

---

## Question 9

Which of the following Windows events is logged every time when a user tries to access the "Registry" key?

**A.** 4656
**B.** 4663
**C.** 4660
**D.** 4657

**Answer: D**

**Event ID 4657** corresponds to the modification of a registry value, including creation, modification, and deletion. For the event to be logged, "Set Value" auditing must be enabled in the registry key's SACL.

---

## Question 10

The SOC team at GlobalTech has finished patching a critical vulnerability exploited during a ransomware attack. The team is now restoring 2.3 TB of encrypted data from Veeam backup, rebuilding 23 compromised workstations, and re-enabling network access for the finance department. Which Incident Response phase is this?

**A.** Post-incident activities
**B.** Containment
**C.** Eradication
**D.** Recovery

**Answer: D**

**Recovery** focuses on restoring systems and business operations to a normal, trusted state after the threat has been contained and eradicated. Restoring encrypted data, rebuilding workstations, and re-enabling network access are all recovery tasks.

---

## Question 11

Which of the following tools can be used to filter web requests associated with SQL Injection attacks?

**A.** Nmap
**B.** UrlScan
**C.** ZAP proxy
**D.** Hydra

**Answer: B**

**UrlScan** screens all incoming requests to a server and filters based on rules set by the administrator. It can block requests containing SQL syntax or certain keywords used in SQL Injection.

---

## Question 12

A SOC analyst is designing a security dashboard for real-time monitoring. The organization wants to avoid overwhelming analysts with excessive information. Which principle should guide the design?

**A.** Include as much data as possible to ensure complete visibility
**B.** Restrict dashboard access to only network administrators
**C.** Prioritize critical information and remove unnecessary details
**D.** Use only historical data to avoid real-time inconsistencies

**Answer: C**

SOC dashboards are operational tools. The guiding principle is to maximize analyst decision speed and accuracy under time pressure. **Prioritizing critical information** reduces cognitive overload and alert fatigue, which are major contributors to missed high-severity incidents.

---

## Question 13

David Reynolds implements an automatic account lockout policy that temporarily disables accounts after multiple failed login attempts. Within the SOC's eradication strategy, which category of measures does this action align with?

**A.** Physical security measures
**B.** Network security measures
**C.** Host security measures
**D.** Authentication and authorization measures

**Answer: D**

Account lockout is an **identity control** that directly strengthens authentication by limiting repeated password guessing attempts. It governs how accounts authenticate and how access is granted or denied based on login outcomes.

---

## Question 14

Bonney's system has been compromised by a gruesome malware. What is the primary step advisable to contain the malware incident from spreading?

**A.** Complain to police in a formal way regarding the incident
**B.** Turn off the infected machine
**C.** Leave it to the network administrators to handle
**D.** Call the legal department and inform about the incident

**Answer: B**

The primary step in containing a malware incident is to **isolate the infected machine** to prevent the malware from spreading. This can be done by disconnecting it from the network and turning it off.

---

## Question 15

A major financial institution detects an employee workstation initiating large file transfers outside business hours, involving sensitive customer financial records. Remote access from an unfamiliar IP and unauthorized USB device connection are discovered. What should be your first step?

**A.** Isolate the employee's workstation and revoke remote access
**B.** Conduct a full forensic analysis first
**C.** Disable the corporate VPN entirely
**D.** Inform the employee's department and wait for evidence

**Answer: A**

The first step should prioritize **immediate containment** to stop ongoing exfiltration. Isolating the workstation and revoking remote access directly reduces the attacker's ability to continue transferring sensitive data. Containment precedes deep forensics when active harm is likely.

---

## Question 16 ❌

In which log collection mechanism does the system or application send log records either on the local disk or over the network?

**A.** Rule-based
**B.** Pull-based
**C.** Push-based
**D.** Signature-based

**Answer: C**

In a **push-based** log collection mechanism, the system or application actively sends (pushes) log records to a designated storage location. This is in contrast to pull-based, where records are retrieved by the management server.

---

## Question 17

DNS logs show an internal host sending many DNS queries with long, encoded subdomains to an external domain. The queries predominantly use TXT records and occur during off-business hours. The external domain is newly registered. Which option best explains this behavior?

**A.** Monitoring DNS cache poisoning attempts
**B.** Detecting rogue DNS servers within the internal network
**C.** Identifying DNS tunneling for data exfiltration
**D.** Validating DNS records for legitimate business operations

**Answer: C**

This pattern is highly consistent with **DNS tunneling** used for C2 or data exfiltration. Long, encoded subdomains embed data into DNS queries (base32/base64/hex encoded). TXT records are frequently abused in tunneling because they can return larger payloads.

---

## Question 18

Identify the attack in which the attacker exploits a target system through publicly known but still unpatched vulnerabilities.

**A.** Slow DoS Attack
**B.** DHCP Starvation
**C.** Zero-Day Attack
**D.** DNS Poisoning Attack

**Answer: C**

A **Zero-Day Attack** refers to the exploitation of a publicly known but still unpatched vulnerability. The term "zero-day" means developers have "zero days" to fix the issue because it has already been exploited in the wild.

---

## Question 19

Identify the HTTP status codes that represent server errors.

**A.** 2XX
**B.** 4XX
**C.** 1XX
**D.** 5XX

**Answer: D**

**5XX** status codes indicate server errors—the server is aware that it has encountered an error or is incapable of performing the request. Examples: 500 (Internal Server Error), 501 (Not Implemented), 502 (Bad Gateway).

---

## Question 20 ❌

What type of event is recorded when an application driver loads successfully in Windows?

**A.** Error
**B.** Success Audit
**C.** Warning
**D.** Information

**Answer: D**

When an application driver loads successfully, it is recorded as an **"Information"** event. This type indicates the successful operation of an application or system component.

---

## Question 21

One week after a ransomware attack, Sarah leads a review meeting. The group reviews the incident timeline, calculates a business impact of $157,000, and identifies seven critical improvements. Which Incident Response phase is this?

**A.** Recovery
**B.** Post-Incident Activities
**C.** Eradication
**D.** Containment

**Answer: B**

This is **Post-Incident Activities** (lessons learned). The defining elements: the incident is already over, stakeholders are reviewing the timeline, calculating business impact, and identifying improvements to processes and controls.

---

## Question 22

Identify the type of attack where an attacker injects a script into the URL of www.example.com that triggers an alert message.

**A.** Cross-site Scripting Attack
**B.** Session Attack
**C.** Denial-of-Service Attack
**D.** SQL Injection Attack

**Answer: A**

The scenario depicts a **Cross-site Scripting (XSS)** attack. The attacker adds a script to the URL that causes the website to display an alert message, indicating the website is not properly sanitizing inputs.

---

## Question 23

Which of the following attacks causes sudden changes in file extensions or increase in file renames at rapid speed?

**A.** Ransomware Attack
**B.** DoS Attack
**C.** DHCP starvation Attack
**D.** File Injection Attack

**Answer: A**

**Ransomware attacks** typically cause sudden changes in file extensions or rapid file renames as files are encrypted.

---

## Question 24

A financial services company's SOC is at Level 1 and aims to reach Level 3. What should be the first priority in transitioning from Level 1 to Level 3?

**A.** Outsourcing SOC operations to an MSSP
**B.** Deploying advanced deception technologies
**C.** Establishing well-defined and repeatable incident response processes
**D.** Implementing AI-driven automation for real-time detection and response

**Answer: C**

Moving from low-maturity to more capable SOC requires a stable operational foundation first. **Well-defined and repeatable IR processes** create consistency in how alerts are triaged, escalated, contained, investigated, and documented. Without standardized processes, adding AI or deception technologies can amplify confusion.

---

## Question 25

A multinational cybersecurity firm wants to integrate real-time threat feeds into Microsoft Sentinel using an industry-standard protocol for automated threat intelligence sharing. Which data connector should be implemented?

**A.** Threat Intelligence Platforms data connector
**B.** Syslog connector
**C.** TAXII data connector
**D.** Microsoft Defender for Cloud (Legacy) connector

**Answer: C**

**TAXII** (Trusted Automated eXchange of Indicator Information) is an industry-standard protocol for automated threat intelligence transport, commonly used alongside STIX-formatted threat data. The TAXII data connector enables pulling indicator data from TAXII servers.

---

## Question 26

Which of the following contains performance measures, and proper project and time management details?

**A.** Incident Response Policy
**B.** Incident Response Tactics
**C.** Incident Response Process
**D.** Incident Response Procedures

**Answer: D**

**Incident Response Procedures** contain performance measures and proper project and time management details. They include specific steps, roles and responsibilities, timelines, and performance metrics.

---

## Question 27

Which one of the following is the correct flow for Setting Up a Computer Forensics Lab?

**A.** Planning and budgeting → Physical location and structural design considerations → Work area considerations → Human resource considerations → Physical security recommendations → Forensics lab licensing
**B.** Planning and budgeting → Physical location and structural design considerations → Forensics lab licensing → Human resource considerations → Work area considerations → Physical security recommendations
**C.** Planning and budgeting → Forensics lab licensing → Physical location and structural design considerations → Work area considerations → Physical security recommendations → Human resource considerations
**D.** Planning and budgeting → Physical location and structural design considerations → Forensics lab licensing → Work area considerations → Human resource considerations → Physical security recommendations

**Answer: A**

Correct flow: **Planning and budgeting → Physical location and structural design → Work area considerations → Human resource considerations → Physical security recommendations → Forensics lab licensing**

---

## Question 28

Lisa Carter evaluates three key factors: likelihood of attack succeeding, impact on critical business operations, and value of assets targeted. Using the standard risk assessment approach, which scenario represents the highest risk?

**A.** High Likelihood, High Impact, High Asset Value
**B.** Low Likelihood, High Impact, Low Asset Value
**C.** Low Likelihood, Low Impact, High Asset Value
**D.** High Likelihood, Low Impact, High Asset Value

**Answer: A**

The highest risk is **High Likelihood + High Impact + High Asset Value**. Risk is commonly treated as a function of probability and consequence; incorporating asset value amplifies both harm and urgency.

---

## Question 29

InfoSystem LLC is establishing an in-house SOC. John has been given the responsibility to finalize strategy, policies, and procedures for the SOC. Identify the job role of John.

**A.** Chief Information Security Officer (CISO)
**B.** Security Analyst - L1
**C.** Security Analyst - L2
**D.** Security Engineer

**Answer: A**

The responsibility to finalize **strategy, policies, and procedures** for the SOC aligns with the **CISO** role.

---

## Question 30

A Threat Hunter incorporates multiple data sources (external threat intelligence feeds, internal security logs, network traffic data, and endpoint telemetry) and implements a tool that can aggregate, normalize, and correlate threat intelligence with internal telemetry. What key threat detection capability is being leveraged?

**A.** Threat Reports
**B.** Intelligence Buy-In
**C.** Threat Trending
**D.** Data Integration

**Answer: D**

**Data Integration** is the core of combining multiple heterogeneous data sources into a single analytical view so that signals can be correlated into higher-confidence detections.

---

## Question 31

John wants to prepare a dashboard in the SIEM to get a graph identifying locations from where Tor traffic is coming. Which data source will he use?

**A.** DHCP/Logs capable of maintaining IP addresses or hostnames with IP to Name resolution
**B.** IIS/Web Server logs with IP addresses and user agent IP to user agent resolution
**C.** DNS/Web Server logs with IP addresses
**D.** Apache/Web Server logs with IP addresses and Host Name

**Answer: A**

**DHCP logs** or similar log sources capable of maintaining detailed IP address records and facilitating IP-to-Name resolution would be suitable for mapping Tor traffic source IP addresses to their corresponding locations or identities.

---

## Question 32

Which of the following directories will contain logs related to printer access?

**A.** /var/log/cups/Printer_log file
**B.** /var/log/cups/access_log file
**C.** /var/log/cups/accesslog file
**D.** /var/log/cups/Printeraccess_log file

**Answer: B**

Printer access logs are stored in **/var/log/cups/access_log**.

---

## Question 33

A SOC team needs to implement an automated log parsing solution to transform unstructured logs into structured format. Which log parsing technique should they implement?

**A.** Delimited parsing
**B.** Key-value extraction
**C.** Grok filters
**D.** Semantic parsing

**Answer: C**

**Grok filters** are widely used to parse unstructured or semi-structured logs into structured fields by applying pattern-based extraction. They allow analysts to define reusable patterns and map extracted values into normalized fields.

---

## Question 34

Which of the following factors determine the choice of SIEM architecture?

**A.** SMTP Configuration
**B.** DHCP Configuration
**C.** DNS Configuration
**D.** Network Topology

**Answer: D**

**Network Topology** determines the layout of the network, including the arrangement of nodes and connections, which directly affects how the SIEM system will be integrated into the environment.

---

## Question 35

During the Containment Phase of a phishing attack investigation, the SOC needs to determine how users interacted with the malicious email. Which specific activity helps the SOC team understand user interactions?

**A.** Monitoring and containment validation
**B.** Malware infection check
**C.** User action verification
**D.** Blocking command-and-control (C2) and email traffic

**Answer: C**

**User action verification** directly answers "what did users do with the phishing message?" This drives priority actions such as password resets, session revocation, MFA re-registration, and endpoint isolation.

---

## Question 36

A SOC analyst detects multiple instances of powershell.exe being launched with `-ExecutionPolicy Bypass` and `-NoProfile` on a domain controller. The parent process is winrm.exe, occurring during non-business hours. What should be the primary focus?

**A.** Look for Event ID 4625 to check for failed authentication attempts
**B.** Investigate Event ID 7045 to determine if a malicious service was created
**C.** Search for Event ID 4688 to find similar PowerShell executions within the last 24 hours
**D.** Review Event ID 5145 to see if unauthorized network shares were accessed

**Answer: C**

**Event ID 4688** records process creation and can capture command-line details. Searching for similar 4688 events helps identify frequency, affected accounts, and whether the same command line appears across hosts.

---

## Question 37

Which step of incident handling and response process focuses on limiting the scope and extent of an incident?

**A.** Containment
**B.** Data Collection
**C.** Eradication
**D.** Identification

**Answer: A**

**Containment** aims to isolate affected systems to prevent the spread of the incident and minimize its impact. Strategies may involve disconnecting systems, blocking malicious traffic, or taking systems offline.

---

## Question 38

The SOC team wants to automate routine security tasks (log collection, alert triaging, remediation steps, notifications). Which component of Microsoft Sentinel should they utilize?

**A.** Community
**B.** Playbooks
**C.** Workspace
**D.** Analytics

**Answer: B**

**Playbooks** in Microsoft Sentinel are used to automate incident response workflows. They operationalize consistent actions at machine speed: enrich alerts, notify stakeholders, open tickets, isolate endpoints, disable accounts, and block indicators.

---

## Question 39 ❌

Which of the following stages is executed after identifying the required event sources?

**A.** Identifying the Monitoring Requirements
**B.** Defining Rule for the Use Case
**C.** Implementing and Testing the Use Case
**D.** Validating the event source against monitoring requirement

**Answer: B**

After identifying the required event sources, the next stage is to **define rules for the use case**—specifying the criteria or conditions that will trigger alerts or actions based on the data received.

---

## Question 40

Which of the following commands is used to view iptables logs on Ubuntu and Debian distributions?

**A.** $ tailf /var/log/sys/kern.log
**B.** $ tailf /var/log/kern.log
**C.** # tailf /var/log/messages
**D.** # tailf /var/log/sys/messages

**Answer: B**

On Ubuntu and Debian: **`$ tailf /var/log/kern.log`** — this follows the end of the kernel log file in real-time.

---

## Question 41

To ensure PostgreSQL captures and stores logs for centralized monitoring and forensic analysis, which configuration parameter should you enable?

**A.** logging-collector
**B.** log_collector
**C.** loggingcollector
**D.** logging-collector (with space)

**Answer: B**

In PostgreSQL, the parameter **`log_collector`** enables writing logs to files via the logging collector process. When enabled, PostgreSQL can collect stderr output from backend processes and route it into log files.

---

## Question 42

What does HTTPS Status code 403 represent?

**A.** Unauthorized Error
**B.** Not Found Error
**C.** Internal Server Error
**D.** Forbidden Error

**Answer: D**

**403 Forbidden** — the server understands the request but refuses to authorize it. Unlike 401 (Unauthorized), re-authenticating will make no difference; access is denied regardless of authentication status.

---

## Question 43

If the SIEM generates four alerts simultaneously:
I. Firewall blocking traffic alerts
II. SQL injection attempt alerts
III. Data deletion attempt alerts
IV. Brute-force attempt alerts

Which alert should be given least priority?

**A.** III
**B.** IV
**C.** II
**D.** I

**Answer: D**

**Firewall blocking traffic alerts** should be given least priority because the firewall is effectively doing its job by blocking unwanted traffic—the immediate threat has already been mitigated.

---

## Question 44

Identify the attack where an attacker tries to discover all possible information about a target network before launching a further attack.

**A.** DoS Attack
**B.** Man-In-Middle Attack
**C.** Ransomware Attack
**D.** Reconnaissance Attack

**Answer: D**

A **Reconnaissance Attack** involves gathering information about a target network before launching further attacks. It can be passive (without directly interacting with the target) or active (port scanning).

---

## Question 45

Jason is investigating Cisco ASA Firewall logs with the entry: `%ASA-5-11008: User 'enable_15' executed the 'configure term' command`. What does the security level indicate?

**A.** Warning condition message
**B.** Critical condition message
**C.** Normal but significant message
**D.** Informational message

**Answer: C**

Severity level 5 in Cisco ASA corresponds to **"Notification"** level, which indicates a **normal but significant** condition. The execution of 'configure term' by 'enable_15' is a notable event that warrants attention.

---

## Question 46

Global Solutions Inc. uses syslog for centralized logging across a geographically diverse network. To guarantee consistent and dependable log delivery across potentially unreliable network connections, which syslog architectural layer should they focus on optimizing?

**A.** Syslog application layer
**B.** Syslog management and filtering
**C.** Syslog content layer
**D.** Syslog transport layer

**Answer: D**

Reliable delivery across unreliable networks is primarily a **transport-layer** concern. Hardening transport typically involves using TCP, TLS for encryption and integrity, buffering/queueing at relays, and retransmission handling.

---

## Question 47

According to the Risk Matrix table, what will be the risk level when the probability of an attack is very high, and the impact is major?

**A.** High
**B.** Extreme
**C.** Low
**D.** Medium

**Answer: B**

When probability is **very high** and impact is **major**, it typically falls into the **'Extreme'** category. This combination represents an unacceptable risk requiring immediate attention and mitigation.

---

## Question 48

Shawn suggested various components for a threat intelligence strategy plan. Which additional component should he include to make it effective?

**A.** Threat pivoting
**B.** Threat trending
**C.** Threat buy-in
**D.** Threat boosting

**Answer: B**

**Threat trending** involves analyzing data over time to identify patterns and trends in cyber threats, allowing the organization to anticipate potential future attacks and prepare accordingly. It is essential for a proactive threat intelligence program.

---

## Question 49

Which field in Windows logs defines the type of event occurred, such as Correlation Hint, Response Time, SQM, WDI Context?

**A.** Keywords
**B.** Task Category
**C.** Level
**D.** Source

**Answer: B**

**Task Category** in Windows logs defines the type of event that has occurred. It provides additional context about the event, helping in filtering and identifying events based on their nature and type.

---

## Question 50

The forensic team captures system snapshots before and after suspected infection to identify unauthorized changes and anomalies. Which process are they following?

**A.** Digital forensics
**B.** Signature-based detection
**C.** Threat intelligence gathering
**D.** Host integrity monitoring

**Answer: D**

Capturing and comparing system snapshots before and after suspected compromise is a core method of **host integrity monitoring**. By comparing a known-good baseline to a suspected-compromised state, analysts can identify unauthorized changes.

---

## Question 51

Which technique involves scanning the headers of IP packets leaving a network to ensure unauthorized or malicious traffic never leaves the internal network?

**A.** Egress Filtering
**B.** Throttling
**C.** Rate Limiting
**D.** Ingress Filtering

**Answer: A**

**Egress filtering** scans the headers of IP packets as they leave a network to ensure unauthorized or malicious traffic does not exit. It helps prevent data exfiltration and blocks malware C2 communication.

---

## Question 52

Which technique protects from flooding attacks originated from valid prefixes (IP addresses) so they can be traced to their true source?

**A.** Rate Limiting
**B.** Egress Filtering
**C.** Ingress Filtering
**D.** Throttling

**Answer: C**

**Ingress filtering** ensures that incoming packets are actually from the networks they claim to originate from. This is particularly useful in mitigating IP spoofing and helps trace flooding attacks to their true source.

---

## Question 53

A financial institution suspects an insider threat due to unauthorized access attempts on restricted databases. SIEM alerts lack sufficient information. Which contextual data source should be integrated?

**A.** User context from HR systems
**B.** Location and physical context from CPS sensors
**C.** Threat context from external threat intelligence feeds
**D.** Vulnerability context

**Answer: A**

**User context from HR systems** helps determine whether access aligns with the user's role, employment status, and business need. It includes department, job title, manager, location assignment, and employment status.

---

## Question 54

A SOC analyst finds an unrecognized scheduled task triggering a PowerShell script connecting to an unknown IP address. What should be done to confirm whether this is an active attack?

**A.** Analyze the network logs to identify external connections
**B.** Check file integrity and detect recent unauthorized changes
**C.** Analyze the system logs for unauthorized changes
**D.** Review user access logs for unauthorized activity

**Answer: A**

The strongest confirmation for an active attack is evidence of **command-and-control (C2) communication**. Analyzing network telemetry to confirm whether outbound connections are occurring is the fastest way to validate ongoing activity.

---

## Question 55

Mike performed incident analysis and validation to check whether the incident is a true incident or a false positive. Identify the stage he is currently in.

**A.** Post-Incident Activities
**B.** Incident Recording and Assignment
**C.** Incident Triage
**D.** Incident Disclosure

**Answer: C**

**Incident Triage** involves incident analysis and validation to determine if the incident is a true incident or a false positive. This stage helps in prioritizing incidents based on their severity, impact, and urgency.

---

## Question 56 ❌

Banter is currently formatting and structuring raw data. He is at which stage of the threat intelligence life cycle?

**A.** Dissemination and Integration
**B.** Processing and Exploitation
**C.** Collection
**D.** Analysis and Production

**Answer: B**

**Processing and Exploitation** involves formatting and structuring raw data. This phase turns collected data into a format that can be more easily analyzed and used.

---

## Question 57

An organization is implementing SIEM with capabilities shown in the figure. What kind of SIEM deployment architecture is being planned?

**A.** Self-hosted, MSSP Managed
**B.** Self-hosted, Self-Managed
**C.** Cloud, MSSP Managed
**D.** Self-hosted, Jointly Managed

**Answer: B**

**Self-hosted, Self-Managed** — the organization hosts and manages the SIEM infrastructure entirely on its own.

---

## Question 58

According to the forensics investigation process, what is the next step right after collecting evidence?

**A.** Create a Chain of Custody Document
**B.** Send it to the nearby police station
**C.** Set a Forensic lab
**D.** Call Organizational Disciplinary Team

**Answer: A**

After collecting evidence, the next critical step is to **create a Chain of Custody Document**. This records the evidence's chronological history, detailing every person who handled the evidence, the date/time it was collected, transferred, or analyzed.

---

## Question 59

Robin's organization can perform only Correlation, Analytics, Reporting, Retention, Alerting, and Visualization, and must take collection and aggregation services from an MSSP. What kind of SIEM is Robin planning?

**A.** Self-hosted, Self-Managed
**B.** Self-hosted, MSSP Managed
**C.** Hybrid Model, Jointly Managed
**D.** Cloud, Self-Managed

**Answer: C**

This setup indicates a **Hybrid Model, Jointly Managed** — both the organization and the MSSP share responsibilities for managing different aspects of the SIEM.

---

## Question 60

Which process refers to discarding packets at the routing level without informing the source that the data did not reach its intended recipient?

**A.** Load Balancing
**B.** Rate Limiting
**C.** Black Hole Filtering
**D.** Drop Requests

**Answer: C**

**Black hole filtering** directs traffic to a null interface where packets are dropped without acknowledgment. It is typically used to protect against DoS attacks.

---

## Question 61

John identified an event log matching Regex `/(\.|(%|%25)2E)(\.|(%|%25)2E)(\/|(%|%25)2F|\\|(%|%25)5C)/i`. What does this indicate?

**A.** XSS Attack
**B.** SQL Injection Attack
**C.** Directory Traversal Attack
**D.** Parameter Tampering Attack

**Answer: C**

This regex pattern matches sequences like `../` or `..%2F`, which are commonly used in **Directory Traversal Attacks** to navigate up the directory tree and access files outside the intended directory.

---

## Question 62

A financial institution integrates AI capabilities into the SIEM, resulting in a significant decrease in redundant alerts and faster detection of genuine threats. Which AI capability contributed to this improvement?

**A.** Dynamic rule optimization
**B.** Rule validation and testing
**C.** Automated rule generation
**D.** Data integration enhancement

**Answer: A**

**Dynamic rule optimization** tunes thresholds, suppresses noisy patterns, and adjusts scoring based on context. This reduces duplicate/low-value alerts while preserving or improving sensitivity for real threats.

---

## Question 63

An HR department receives an urgent email from someone impersonating a high-level executive, requesting immediate transfer of sensitive employee data. The HR manager calls a phone number in the email and "confirms" the request. What type of attack is this?

**A.** Credential theft
**B.** Web-based intrusion
**C.** Social engineering attack
**D.** Application exploit

**Answer: C**

This is a **social engineering attack** (specifically business email compromise / executive impersonation fraud). The adversary manipulated human trust and urgency to induce an unauthorized action.

---

## Question 64

Which Windows Event ID helps monitor file sharing across the network?

**A.** 7045
**B.** 4625
**C.** 5140
**D.** 4624

**Answer: C**

**Event ID 5140** is used to monitor file sharing across a network. It is triggered every time a network share object is accessed and generates once per session when the first access attempt is made.

---

## Question 65

A SOC team uses a security solution that inspects data packets in real time but struggles to analyze encrypted traffic. Which security control are they relying on?

**A.** VPN
**B.** Packet filters
**C.** SSH
**D.** IPsec

**Answer: B**

**Packet filters** inspect packet headers (source/destination IP, ports, protocol flags) to allow or block traffic. Their known limitation is that they generally do not inspect encrypted payload content.

---

## Question 66

Secuzin Corp. needs a log storage solution that is scalable, provides encryption, and is seamlessly accessible for long-term archival. Which storage solution should be chosen?

**A.** Distributed storage system
**B.** Hybrid storage system
**C.** Local storage
**D.** Cloud storage

**Answer: D**

**Cloud storage** best meets long-term log archival requirements with scalable storage, encryption at rest and in transit, lifecycle management, retention policies, and immutability options.

---

## Question 67

Charline, an L2 SOC Analyst, confirmed an incident and assigned it with an initial priority. What would be her next action according to the SOC workflow?

**A.** She should formally raise a ticket and forward it to the IRT
**B.** She should communicate this incident to the media immediately
**C.** She should immediately escalate this issue to the management
**D.** She should immediately contact the network administrator

**Answer: A**

Once an L2 analyst confirms an incident, the SOC workflow dictates **formally raising a ticket** and forwarding it to the **Incident Response Team (IRT)** for deeper analysis, containment, eradication, and recovery.

---

## **Question 68** ❌

Which threat intelligence helps cybersecurity professionals understand how adversaries are expected to perform the attack, their technical capabilities, goals, and attack vectors?

**A.** Analytical Threat Intelligence
**B.** Operational Threat Intelligence
**C.** Strategic Threat Intelligence
**D.** Tactical Threat Intelligence

**Answer: B**

**Operational Threat Intelligence** focuses on the specifics of imminent or ongoing attacks, providing insights into the identity of attackers, their motivation, capabilities, objectives, and TTPs.

---

## **Question 69** ❌

In which phase of Lockheed Martin's Cyber Kill Chain Methodology does the adversary create a deliverable malicious payload using an exploit and a backdoor?

**A.** Reconnaissance
**B.** Delivery
**C.** Weaponization
**D.** Exploitation

**Answer: C**

The **Weaponization** phase is where the adversary creates a deliverable malicious payload using an exploit and a backdoor. This occurs after Reconnaissance and before Delivery.

---

## Question 70

John wants to monitor process creation activities from Windows endpoints. Which Splunk query will help?

**A.** `index=windows LogName=Security EventCode=4678 NOT (Account_Name=*$)`
**B.** `index=windows LogName=Security EventCode=4688 NOT (Account_Name=*$)`
**C.** `index=windows LogName=Security EventCode=3688 NOT (Account_Name=*$)`
**D.** `index=windows LogName=Security EventCode=5688 NOT (Account_Name=*$)`

**Answer: B**

**EventCode=4688** signifies a process creation event in Windows security event logs. The query filters to show events where a new process has been created.

---

## Question 71

An organization can do only log collection and the rest of SIEM functions must be managed by an MSSP. Which SIEM deployment architecture will they adopt?

**A.** Cloud, MSSP Managed
**B.** Self-hosted, Jointly Managed
**C.** Self-hosted, MSSP Managed
**D.** Self-hosted, Self-Managed

**Answer: C**

**Self-hosted, MSSP Managed** — the organization retains the SIEM infrastructure on-premises but outsources management, monitoring, and analysis functions to an MSSP.

---

## **Question 72** ❌

A manufacturing company uses an output-driven approach for SIEM deployment, starting with use cases for unauthorized access to production control systems. What is the primary advantage?

**A.** The company avoids the need to collect logs from non-critical systems
**B.** The SIEM system can automatically block all unauthorized access attempts
**C.** The company can create more complex use cases with greater scope
**D.** The SOC team can respond to all incidents in real time without delays

**Answer: C**

An **output-driven approach** starts with clearly defined outcomes and works backward. The key advantage is the ability to build use cases incrementally and expand scope in a controlled way, resulting in more complex and meaningful detections over time.

---

## **Question 73** ❌

A security team with limited resources must prioritize monitoring scenarios. Which factor should guide their selection of use cases?

**A.** Select use cases based on the availability and quality of data from existing data sources
**B.** Prioritize use cases that address zero-day attacks
**C.** Implement as many use cases as the SIEM supports
**D.** Focus on use cases required to meet industry compliance standards

**Answer: A**

Use cases should be selected based on **data availability and quality** because detections cannot work without reliable telemetry. Choosing use cases that the environment can actually support produces faster time-to-value and fewer false positives.

---

## Question 74

According to the Risk Matrix, what will be the risk level when probability is very low and impact is major?

**A.** High
**B.** Extreme
**C.** Low
**D.** Medium

**Answer: C**

Very low probability + major impact = **Low** risk level. The overall risk is mitigated by the low chance of the event happening, despite the potential for significant impact.

---

## Question 75

During the Analysis Phase, the SOC team wants to confirm initial findings and eliminate false alarms. Which action should they take?

**A.** Verify generated logs
**B.** Verify false positives
**C.** Scan the enterprise environment and update the scope
**D.** Root-cause analysis

**Answer: B**

**Verify false positives** — analysts review alert evidence, confirm telemetry validity, and look for corroborating artifacts to decide whether the alert is a true positive or false alarm.

---

## Question 76 ❌

Which attack inundates DHCP servers with fake DHCP requests to exhaust all available IP addresses?

**A.** DHCP Starvation Attacks
**B.** DHCP Spoofing Attack
**C.** DHCP Port Stealing
**D.** DHCP Cache Poisoning

**Answer: A**

**DHCP Starvation Attack** floods the DHCP server with fake DHCP DISCOVER messages using spoofed MAC addresses to exhaust the address pool, potentially leading to DoS for new devices.

---

## Question 77

NationalHealth, a government agency handling sensitive patient health records, is subject to strict data sovereignty regulations. They have a large budget and can hire many professionals. Which SOC model is most suitable?

**A.** Outsourced SOC model
**B.** Hybrid SOC model
**C.** In-house/internal SOC model
**D.** A combination of multiple MSSPs

**Answer: C**

An **in-house/internal SOC model** best fits when data sovereignty, strict control of sensitive data, and operational independence are top priorities and when the organization has the budget and staffing capacity.

---

## Question 78

Which Windows feature is used to enable Security Auditing?

**A.** Bitlocker
**B.** Windows Firewall
**C.** Local Group Policy Editor
**D.** Windows Defender

**Answer: C**

The **Local Group Policy Editor** (`gpedit.msc`) allows administrators to configure security policies and audit settings. Navigate to: Computer Configuration → Windows Settings → Security Settings → Local Policies → Audit Policy.

---

## **Question 79** ❌

Which of the following is a set of standard guidelines for ongoing development, enhancement, storage, dissemination and implementation of security standards for account data protection?

**A.** FISMA
**B.** HIPAA
**C.** PCI-DSS
**D.** DARPA

**Answer: C**

**PCI-DSS** (Payment Card Industry Data Security Standard) is a set of security standards designed to ensure that all companies that accept, process, store, or transmit credit card information maintain a secure environment.

---

## **Question 80** ❌

Which of the following is a Threat Intelligence Platform?

**A.** SolarWinds MS
**B.** TC Complete
**C.** Keepnote
**D.** Apility.io

**Answer: B**

**ThreatConnect Complete (TC Complete)** is a Threat Intelligence Platform (TIP) designed to aggregate, analyze, and disseminate threat intelligence data.

---

## Question 81

Chloe is investigating files at `/var/log/wtmp`. What is she looking at?

**A.** Error log
**B.** System boot log
**C.** General message and system-related stuff
**D.** Login records

**Answer: D**

**`/var/log/wtmp`** records all logins and logouts. It is a binary file that can be read with the `last` command to display login history.

---

## **Question 82** ❌

A SOC is overwhelmed by thousands of daily alerts based on IoCs that lack context. Analysts waste time on low-priority incidents while severe threats may be missed. Which poses the greatest challenge?

**A.** Malware-centric and CTI are not equivalent
**B.** Information overload
**C.** Budget and enterprise skill
**D.** Distinguishing IoC from CTI

**Answer: D**

The core problem is that the SOC is treating raw indicators (IoCs) as if they are actionable intelligence (CTI) without enough context. **Distinguishing IoC from CTI** is the fundamental challenge — IoCs are low-context and high-volume, while CTI adds adversary, campaign, intent, and confidence.

---

## Question 83

Which is the correct flow of stages in an Incident Handling and Response (IH&R) process?

**A.** Containment → Incident Recording → Incident Triage → Preparation → Recovery → Eradication → Post-Incident Activities
**B.** Preparation → Incident Recording → Incident Triage → Containment → Eradication → Recovery → Post-Incident Activities
**C.** Incident Triage → Eradication → Containment → Incident Recording → Preparation → Recovery → Post-Incident Activities
**D.** Incident Recording → Preparation → Containment → Incident Triage → Recovery → Eradication → Post-Incident Activities

**Answer: B**

**Preparation → Incident Recording → Incident Triage → Containment → Eradication → Recovery → Post-Incident Activities**

---

## Question 84

Sam detected an event matching regex `/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/ix`. What does this indicate?

**A.** SQL Injection Attack
**B.** Parameter Tampering Attack
**C.** XSS Attack
**D.** Directory Traversal Attack

**Answer: A**

This regex detects **SQL injection attacks** by looking for common payloads: an apostrophe/single quote (`'` or `%27`) followed by the logical operator OR (`o`, `%6F`, `O`, `%4F`, `r`, `%72`, `R`, `%52`).

---

## Question 85

Jony identified IIS log events with complex SQL queries including functions like "UNICODE", "SUBSTRING", and "MAX" with characters like CHAR(97) and CHAR(108). What does this indicate?

**A.** Parameter Tampering Attack
**B.** XSS Attack
**C.** Directory Traversal Attack
**D.** SQL Injection Attack

**Answer: D**

The IIS log events indicate a **SQL Injection Attack**, evident from complex SQL queries with functions like UNICODE, SUBSTRING, and MAX, along with CHAR() functions used to bypass security mechanisms.

---

## Question 86

The Digital Forensics team deploys a forensics workstation to acquire RAM dumps, extract Windows Event Logs, and collect network PCAP files from compromised hosts. Which phase of the Incident Response lifecycle is underway?

**A.** Recovery
**B.** Evidence gathering and forensic analysis
**C.** Containment
**D.** Eradication

**Answer: B**

**Evidence gathering and forensic analysis** — acquiring RAM dumps, extracting event logs, and collecting PCAPs. This phase focuses on preserving and analyzing artifacts to understand what happened and determine scope.

---

## **Question 87** ❌

Which log storage method arranges event logs in the form of a circular buffer?

**A.** FIFO
**B.** LIFO
**C.** Non-wrapping
**D.** Wrapping

**Answer: D**

A circular buffer uses a single, fixed-size buffer as if connected end-to-end. When the buffer is full, new data is written starting at the beginning, "wrapping" around. This is called **wrapping**.

---

## Question 88

A SOC analyst receives a high-priority alert about unusual user activity—an employee account accessing resources from a different country outside normal hours. Which SOAR playbook would be relevant?

**A.** Alert Enrichment SOAR Playbook
**B.** Deprovisioning Users SOAR Playbook
**C.** Malware Containment SOAR Playbook
**D.** Phishing Investigations SOAR Playbook

**Answer: B**

A **Deprovisioning Users** playbook focuses on access removal actions such as disabling the user, revoking active sessions, resetting credentials, and blocking sign-in until verification is complete.

---

## Question 89

An intermediate component receives log messages from different devices and forwards them to the main syslog server. Which component performs this function?

**A.** Syslog Database
**B.** Syslog Collector
**C.** Syslog Listener
**D.** Syslog Relay

**Answer: D**

A **syslog relay** is specifically used as an intermediary that receives syslog messages from multiple sources and forwards them to an upstream (central) syslog server. It provides buffering during intermittent connectivity and local aggregation.

---

## Question 90

What does Windows Security Log Event ID 4624 indicate?

**A.** Service added to the endpoint
**B.** A share was assessed
**C.** An account was successfully logged on
**D.** New process executed

**Answer: C**

**Event ID 4624** indicates that an **account was successfully logged on**. This event is generated when a logon session is created (user logging on, service starting, or scheduled task running).

---

## Question 91

Several web servers use a vulnerable third-party library flagged for a zero-day exploit. Patches were deployed but rolled back due to instability. How should the security team classify this risk?

**A.** Software and data integrity failures
**B.** Security logging and monitoring failures
**C.** Vulnerable and outdated components
**D.** Insecure design

**Answer: C**

This is best classified as **"Vulnerable and outdated components"** — the organization is knowingly running a third-party library with a known exploitable vulnerability and has rolled back the available fix.

---

## Question 92

CyberBank needs a solution offering continuous security monitoring, rapid threat detection, and centralized visibility across all branches, with automated alerting, digital forensics capabilities, and active threat hunting. Which solution?

**A.** Implementing SOAR
**B.** Implementing periodic security audits
**C.** Implementing a Security Operations Center (SOC)
**D.** Deploying a standalone SIEM system

**Answer: C**

A **SOC** combines people, process, and technology to deliver continuous monitoring, detection, investigation, and response. It provides centralized visibility, 24/7 coverage, proactive hunts, and structured reporting.

---

## **Question 93** ❌

David detects unauthorized applications running on a high-privilege Windows server. Installations occurred outside business hours. Which log should he examine to determine when and how these installations occurred?

**A.** Security event log
**B.** System event log
**C.** Setup event log
**D.** Application event log

**Answer: C**

The **Setup event log** captures events related to software installation, servicing, and setup operations. It can contain MSI and update-related events, component installation records, and indications of system changes tied to installation workflows.

---

## **Question 94** ❌

You implement credential encryption, behavioral analytics, and process isolation following a structured framework that maps defensive techniques to known adversarial tactics. Which framework?

**A.** Systems Security Engineering CMM
**B.** MITRE D3FEND Framework
**C.** Cybersecurity Capability Maturity Model
**D.** NIST Cybersecurity Framework 2.0

**Answer: B**

**MITRE D3FEND** is specifically designed to map defensive techniques to offensive adversary behaviors. It provides a structured defensive ontology: identify an adversary technique and select defensive countermeasures.

---

## Question 95

Which attack works like a dictionary attack but adds numbers and symbols to dictionary words to crack passwords?

**A.** Hybrid Attack
**B.** Bruteforce Attack
**C.** Rainbow Table Attack
**D.** Birthday Attack

**Answer: A**

A **Hybrid Attack** combines elements of a dictionary attack with brute force—taking words from a dictionary and augmenting them with numbers and symbols to generate potential passwords.

---

## **Question 96** ❌

A SOC team notices malware incidents increased over six months, primarily targeting endpoints through phishing. They need a report to justify investing in advanced email filtering and end-user training. Which SOC report best supports their case?

**A.** Monitoring summary report
**B.** Real-time monitoring report
**C.** Incident report
**D.** Trend analysis report

**Answer: D**

A **trend analysis report** shows how incident frequency, types, severity, and impact change over time. It can quantify growth rates, highlight recurring patterns, and estimate business risk—supporting a clear business case for budget.

---

## **Question 97** ❌

What does Windows event ID 4740 indicate?

**A.** A user account was locked out
**B.** A user account was disabled
**C.** A user account was enabled
**D.** A user account was created

**Answer: A**

**Event ID 4740** indicates a **user account has been locked out** due to repeated logon failures (typically incorrect password entries).

---

## Question 98

At 9:15 AM, Marcus Wong contacts the SOC after noticing Excel spreadsheets automatically encrypting with unusual file extensions. The Tier 1 analyst logs the incident as ticket #INC-89271 and escalates it to a Tier 2 analyst. Which phase is currently taking place?

**A.** Containment
**B.** Incident triage
**C.** Incident recording and assignment
**D.** Notification

**Answer: C**

**Incident recording and assignment** — the SOC formally documents the reported event, creates an incident record in the tracking system, sets initial severity/priority, and assigns ownership for investigation.

---

## Question 99

An organization opts for a phased SIEM deployment approach. Which should be the first phase?

**A.** Automate incident response processes
**B.** Implement User and Entity Behavior Analytics (UEBA)
**C.** Set up the log management component before deploying the SIEM component
**D.** Configure security analytics to identify potential threats

**Answer: C**

The first phase should establish **reliable log ingestion and storage** (log management) before attempting advanced detection content or automation. A SIEM is only as effective as the data it receives.

---

## Question 100

A SOC analyst needs to extract hexadecimal color codes from logs. Which regex pattern should be used?

**A.** `(0[1-9]|1[0-2])/(0[1-9]|(1[0-2])/[0-9]|3[01])\d{4}`
**B.** `([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})`
**C.** `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}`
**D.** `\b\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}\b`

**Answer: B**

**`([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})`** matches either a 6-character hex sequence or a 3-character hex sequence, which are the standard formats for hexadecimal color codes.

![[Pasted image 20260603151527.png]]
![[Pasted image 20260603151627.png]]
![[Pasted image 20260603151346.png]]
![[Pasted image 20260603152256.png]]
![[Pasted image 20260603152552.png]]
![[Pasted image 20260603152740.png]]

![[Pasted image 20260603152843.png]] 
用 `%` 加上该字符对应的两位十六进制 ASCII 值来替换特殊字符
![[Pasted image 20260603153643.png]]
![[Pasted image 20260603153740.png]]
![[Pasted image 20260603153944.png]]

![[Pasted image 20260603154244.png]]
![[Pasted image 20260603154924.png]]
![[Pasted image 20260603155146.png]]
noticed large TXT, NULL payloads
关键点：
TXT Records
NULL Records
Large Payloads
在 DNS 流量中出现大量这类记录，往往意味着：
利用 DNS 协议进行数据泄露（Data Exfiltration

![[Pasted image 20260603155345.png]]
![[Pasted image 20260603160802.png]]

![[Pasted image 20260603160915.png]]

Check Point fw log 命令
fw log [-f [-t]] [-n] ...
其中：
-n 表示：No DNS resolution  即：不将 IP 地址解析为主机名

![[Pasted image 20260603161319.png]]

![[2026-06-03_16-22-13.png]]
A. %SystemDrive%\inetpub\logs\LogFiles\W3SVCN

![[Pasted image 20260603163127.png]]
**SSE-CMM (Systems Security Engineering Capability Maturity Model)**

![[Pasted image 20260603163640.png]]
![[Pasted image 20260603164054.png]]

| 工具                              | 类型                       |
| ------------------------------- | ------------------------ |
| CrowdStrike Falcon Orchestrator | SOAR / Incident Response |
| Symantec Secure Web Gateway     | SWG                      |
| Smoothwall SWG                  | SWG                      |
| Proxy Workbench                 | Proxy Analysis           |
![[Pasted image 20260603164354.png]]
在防御（消除）不安全反序列化攻击时，哪项做法应该避免？
Allow serialization for security-sensitive classes
允许安全敏感类（security-sensitive classes）被序列化

![[Pasted image 20260605094320.png]]

![[Pasted image 20260605094842.png]]In Windows Security Event Logging, **Event ID 4657** indicates that a **registry value was modified (changed, created, or deleted)**. It is part of Object Access auditing and is commonly used in forensic analysis and monitoring for registry tampering or persistence mechanisms.

Which layer in syslog handles the interpretation, routing, and storage of log messages? 
Syslog transport layer Syslog application layer Syslog content layer Syslog security layer
**Syslog application layer**
In the syslog architecture, the **application layer** is responsible for interpreting log messages, applying routing rules, and handling storage or forwarding decisions. It sits above the transport layer (which handles delivery) and the content layer (which defines message structure).


What are the three types of threat hunting approaches mentioned?
Structured, Unstructured, Situational
Manual, Automated, Semi-Automated
Proactive, Reactive, Predictive
Technical, Administrative, Physical
The correct answer is:
**Structured, Unstructured, Situational**


What is a common characteristic of DNS tunneling attempts?
Large number of DNS requests over 512 bytes
High frequency of DNS requests with less than 512 bytes
**Long and random labels in subdomains**
Anomalous DNS query types

What is the function of the ReportEvent function?
**To write an entry to the event log file**
To read event log records
To delete old event log records
To archive event log files

At what level of the Hunting Maturity Model do organizations begin to routinely collect IT data and integrate threat intelligence into their detection processes? 
HM0
HM1
**HM2**
HM4
According to the Hunting Maturity Model (HMM) created by David Bianco, organizations advance through the levels based on their data collection quality and how they act on threat intelligence:  HM0 (Initial): Relies primarily on automated alerting with little to no routine data collection.HM1 (Minimal): Incorporates a moderate or high level of log collection, but hunts are reactive and driven by external reports rather than proactive intelligence.HM2 (Procedural): This is the tipping point where organizations routinely collect high volumes of IT/security data and actively integrate threat intelligence (or procedures created by others) into their detection and hunting processes. They can consistently follow established analytical methodologies to find threats.HM4 (Leading): The highest level, where organizations are highly automated and actively define new hunting tactics rather than just integrating existing threat intelligence.


Which Windows process is responsible for launching services from DLLs and should be investigated for instances without proper "-k" parameters? Services.exe Lsass.exe **Svchost.exe** Winlogon.exe
**✔️ To write an entry to the event log file**
The `ReportEvent` function is used in Windows event logging to **submit (write) events to the Event Log**, such as errors, warnings, or informational messages generated by applications or services.


Which SIEM solution model relies on a third-party vendor to host the SIEM platform, providing features such as data storage and system updates without requiring the organization to manage the infrastructure?
In-house SIEM
Cloud-based SIEM
**Managed SIEM**
Localized SIEM