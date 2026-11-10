/* =====================================================================
   Knowledge base for "Ask about Aakash".
   Edit freely: each entry is one retrievable chunk.
   - title: shown as the source label
   - text: the answer (keep it in third person, plain sentences)
   - keys: extra words people might use to ask about this
   - link: optional "read more" URL
   ===================================================================== */
window.AK_KB = {
  name: "Aakash Kumar",
  email: "aakash.abudhabi@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/aakash-kumar-1a273311a",
    github: "https://github.com/aakash-2904",
    scholar: "https://scholar.google.com/citations?user=uOQj6L4AAAAJ",
    resume: "resume.pdf"
  },

  /* Skills: used to answer "does he know X?" with where he used it. */
  skills: {
    "python": "his main language, used across every project from TrialMatch to the FastAPI approval relay",
    "c++": "listed in his programming skills, with an IIT Bombay Advanced C++ certification (2022)",
    "sql": "SQL and PostgreSQL are in his programming toolkit",
    "postgresql": "listed in his programming toolkit",
    "html": "used to build this portfolio and taught to primary students",
    "css": "used to build this portfolio",
    "pytorch": "used for deep learning work such as MFG-FuseNet brain image fusion",
    "tensorflow": "used for deep learning models across his CV and biomedical research",
    "keras": "used to train MFG-FuseNet for MRI-PET brain image fusion",
    "scikit-learn": "used for classical ML such as the SVM / XGBoost stage of the patented crack detector",
    "xgboost": "used as a classifier on fused CNN features in the concrete crack detection patent",
    "svm": "used as a classifier on fused CNN features in the concrete crack detection patent",
    "langgraph": "used to build TrialMatch, a six-stage multi-agent clinical trial matcher with stateful graphs and conditional routing",
    "langchain": "used for RAG and agent pipelines, including the Protothon-winning Luminary platform",
    "langsmith": "listed for LLM observability",
    "pydantic ai": "listed in his LLM / GenAI toolkit",
    "pydantic": "used in the human-in-the-loop approval relay",
    "rag": "built several RAG systems: TrialMatch (hybrid BM25 + dense with RRF), an RRF-infused summarization RAG, a Gemini RAG for epilepsy clinical reports, and a 200K-vector Pinecone RAG at Divine Success Flow",
    "graphrag": "listed in his LLM / GenAI toolkit",
    "agentic ai": "designs multi-agent systems such as TrialMatch (six agents in LangGraph) and Luminary (Data Bot + Paper Bot)",
    "multi-agent": "designs multi-agent systems such as TrialMatch and Luminary",
    "vector database": "has used Pinecone (200K-vector index, sub-50 ms retrieval) and ChromaDB",
    "pinecone": "built a 200K-vector Pinecone index with sub-50 ms retrieval for lead qualification at Divine Success Flow",
    "chromadb": "listed as one of his vector databases",
    "fine-tuning": "has LLM fine-tuning experience with LoRA and QLoRA",
    "lora": "has LLM fine-tuning experience with LoRA and QLoRA",
    "qlora": "has LLM fine-tuning experience with LoRA and QLoRA",
    "prompt engineering": "uses JSON-schema constrained decoding, validation-driven retries and prompt-prefix ordering for KV-cache reuse in TrialMatch",
    "transformers": "uses Transformers / Hugging Face models, e.g. Sentence Transformers and SciBERT",
    "hugging face": "uses Hugging Face models such as all-MiniLM-L6-v2 and SciBERT",
    "gemini": "uses the Gemini API in TrialMatch, the epilepsy report generator and the stock analysis bot",
    "openai": "built LLM agents with OpenAI Agent Builder at Divine Success Flow",
    "ollama": "runs local LLMs (Qwen2.5-3B) via Ollama in TrialMatch so patient data never leaves the laptop",
    "computer vision": "YOLOv11 mango detection (mAP 0.91), crack detection, leaf disease classification and yoga posture detection",
    "yolo": "used YOLOv11n for mango detection (mAP@0.5 0.91, about 6 MB) during his AI internship",
    "opencv": "used for crack measurement in the concrete crack detection patent",
    "mediapipe": "used for yoga posture detection (Flowing Asanas, IEEE) and sleeping-posture stress detection",
    "deep learning": "the core of his research: 10 publications covering CV, medical imaging and wearables",
    "federated learning": "used in Luminary to share model weights across universities without exposing raw data",
    "docker": "containerized the human-in-the-loop approval relay for cloud deployment",
    "fastapi": "built a FastAPI REST relay with API-key auth, TTL expiry, idempotent decisions and long-polling for the approval system",
    "rest api": "designed resource-oriented REST endpoints in the approval relay",
    "ci/cd": "listed in his MLOps toolkit and part of his MLOps coursework",
    "mlops": "listed in his MLOps / deployment toolkit and studied in his MS (MLOps coursework)",
    "mcp": "listed in his MLOps / deployment toolkit (Model Context Protocol)",
    "n8n": "built 15+ end-to-end automation workflows with n8n at Divine Success Flow, plus a stock analysis Telegram bot",
    "azure": "listed with Azure ML Studio, Blob Storage and Databricks",
    "databricks": "listed with Azure in his deployment toolkit",
    "gcp": "listed in his deployment toolkit",
    "git": "uses Git / GitHub daily",
    "neo4j": "listed in his data engineering toolkit",
    "etl": "builds ETL / data pipelines, e.g. TrialMatch's offline ingestion of TREC 2021 and ClinicalTrials.gov data",
    "pandas": "used for data processing, e.g. the WhatsApp attendance system",
    "numpy": "part of his everyday data toolkit",
    "web scraping": "automated scraping at 1,000+ records/hour at Divine Success Flow",
    "whisper": "automated Whisper transcription at about 15 seconds per audio minute",
    "streamlit": "built the TrialMatch clinician demo in Streamlit",
    "pytest": "wrote pytest suites for TrialMatch and the approval relay",
    "fsl": "used FSL for MRI skull-stripping and reorientation in the epilepsy FCD project",
    "claude code": "uses Claude Code daily and built a remote approval system for its permission prompts",
    "cursor": "uses Cursor and GitHub Copilot as developer tools",
    "agile": "listed with Scrum in his deployment toolkit",
    "nlp": "studied NLP in his B.Tech and applies it in RAG and summarization work",
    "reinforcement learning": "studied Reinforcement Learning in his B.Tech coursework",
    "r": "has worked with R for statistical modeling"
  },

  /* Synonyms so casual phrasing still finds the right skill */
  aliases: {
    "c plus plus": "c++", "cpp": "c++", "postgres": "postgresql", "sklearn": "scikit-learn",
    "torch": "pytorch", "tf": "tensorflow", "lang graph": "langgraph", "lang chain": "langchain",
    "retrieval augmented generation": "rag", "agents": "agentic ai", "agent": "agentic ai", "agentic": "agentic ai",
    "multi agent": "multi-agent", "multiagent": "multi-agent", "vector db": "vector database",
    "finetuning": "fine-tuning", "fine tuning": "fine-tuning", "huggingface": "hugging face", "hf": "hugging face",
    "cv": "computer vision", "vision": "computer vision", "yolov11": "yolo", "open cv": "opencv",
    "dl": "deep learning", "neural networks": "deep learning", "fl": "federated learning",
    "rest": "rest api", "api": "rest api", "kubernetes": null, "k8s": null,
    "ci cd": "ci/cd", "cicd": "ci/cd", "github": "git", "copilot": "cursor", "scrum": "agile",
    "chatgpt": "openai", "gpt": "openai", "llm": "rag", "llms": "rag", "genai": "rag", "generative ai": "rag"
  },

  docs: [
    { title: "Summary", keys: "who is aakash about intro overview background introduce yourself",
      text: "Aakash Kumar is an AI engineer and MS in Artificial Intelligence student at Northeastern University in Boston. He builds LLM agents, RAG systems, computer vision models and biomedical deep learning, with 10 publications (IEEE, Elsevier, Springer, CRC Press) and a patent." },

    { title: "Availability", keys: "available availability co-op coop hire hiring start when relocate relocation open job looking 2027 future",
      text: "He is looking for AI / ML co-op or internship roles for Spring and Summer 2027 (January to August), is happy to relocate, and returns to classes in Fall 2027." },

    { title: "Contact", keys: "contact email reach phone linkedin talk connect message",
      text: "The best way to reach him is email at aakash.abudhabi@gmail.com or LinkedIn. You can also use the form on the Contact page.", link: "contactme.html" },

    { title: "Education: Northeastern", keys: "education degree masters ms northeastern gpa university school coursework study",
      text: "MS in Artificial Intelligence at Northeastern University, Boston (2026 to present), GPA 3.7/4. Coursework: AI, Data Analytics, ML Statistics, MLOps, Data Mining." },

    { title: "Education: VIT Chennai", keys: "education bachelors btech undergrad vit chennai cgpa",
      text: "B.Tech in CSE with a specialization in AI & ML from VIT Chennai (2021 to 2025), CGPA 9.35/10. Coursework: DSA, Deep Learning, NLP, Computer Vision, Reinforcement Learning, LLMs." },

    { title: "Experience: Divine Success Flow", keys: "experience work job internship internships intern past previous automation n8n divine success flow crm leads",
      text: "As an AI Automation Intern at Divine Success Flow (Sep to Dec 2025) he built 15+ n8n automation workflows processing 500 to 2,000 records per run, deployed LLM agents and RAG over a 200K-vector Pinecone index with 90%+ lead qualification accuracy, and cut manual effort by about 70% across 5 client pipelines." },

    { title: "Experience: Modern Agriculture Technology Innovation Center", keys: "experience work internship internships intern past previous agriculture mango farm yolo densenet mobile app",
      text: "As an AI Intern at the Modern Agriculture Technology Innovation Center (Jan to May 2025) he annotated 3,000+ farm images (8,000+ with augmentation), trained YOLOv11n for mango detection (mAP@0.5 0.91) and DenseNet121 for ripeness (about 92% accuracy), and shipped a mobile app with under 400 ms inference." },

    { title: "Experience: Akash EM High School", keys: "experience teaching instructor school attendance whatsapp",
      text: "As Academic Support Intern and CS Instructor at Akash EM High School (2024 to 2025) he automated attendance and fee notifications over WhatsApp and taught Python and HTML to primary students." },

    { title: "Teaching Assistantships", keys: "ta teaching assistant grading responsible ai healthcare phil 5110 hlth 5800 negotiations workplace",
      text: "He has been a Teaching Assistant at Northeastern for four courses: Responsible AI (PHIL 5110, Fall A 2026, 90+ students), AI in Healthcare (HLTH 5800, Summer B 2026, 45+ students), Workplace Skills in Action (EEBA 6410, Summer A 2026) and Negotiations (MGMT 6214, Spring 2026)." },

    { title: "Project: TrialMatch", keys: "trialmatch trial matching clinical trials privacy healthcare langgraph ollama flagship best project",
      text: "TrialMatch is a privacy-preserving multi-agent clinical trial matcher. A six-stage LangGraph pipeline runs a local Qwen2.5-3B through Ollama so patient notes never leave a CPU-only laptop; only public trial text reaches Gemini, enforced by a type-guarded module and pytest checks. Its hybrid RAG (BM25 + dense with Reciprocal Rank Fusion) reached 0.831 nDCG@10 vs 0.712 for BM25 on held-out TREC 2021 patients, with a pre-registered evaluation using bootstrap CIs and Wilcoxon tests.", link: "publications.html" },

    { title: "Project: Human-in-the-Loop Approval System", keys: "approval relay human in the loop claude code fastapi ntfy phone permission",
      text: "He built a remote approval layer for Claude Code: permission requests are intercepted by a hook and pushed to his phone via ntfy for Approve / Deny. The FastAPI relay has API-key auth, TTL expiry, idempotent decisions, rate limiting and long-polling, and the hook never auto-approves; failures fall back to the terminal. Tested with pytest and containerized with Docker.", link: "publications.html" },

    { title: "Project: Luminary (Protothon 8.0 winner)", keys: "luminary protothon hackathon win winner research discovery federated quantum award",
      text: "Luminary won Protothon 8.0 at Northeastern (March 2026). It is a cross-university research discovery platform using Federated Learning, quantum encoding, SciBERT semantic search and QAOA collaboration scoring, with a Data Bot and Paper Bot running in parallel. Aakash built the agent layer.", link: "publications.html" },

    { title: "Project: Concrete Crack Detection (Patent)", keys: "patent crack concrete detection hybrid inception resnet structural",
      text: "His patented (410906-001) hybrid deep learning framework detects concrete cracks with 96.8% accuracy and 0.98 AUC-ROC by fusing features from InceptionV3, ResNet50, DenseNet and VGG and classifying with SVM / XGBoost, estimating crack depth within ±0.4 mm.", link: "publications.html" },

    { title: "Project: RRF-Infused RAG Summarization", keys: "rrf reciprocal rank fusion summarization rouge retrieval",
      text: "An RRF-infused RAG framework for summarization that improved MRR by 19% over standard RAG, with ROUGE-1/2/L of 0.52 / 0.27 / 0.49 over a 500+ document corpus.", link: "publications.html" },

    { title: "Project: Epilepsy FCD Segmentation", keys: "epilepsy fcd mri segmentation convlstm brain lesion medical imaging report",
      text: "An Attention-Enhanced ConvLSTM for FCD epilepsy lesion segmentation on 27,200 FLAIR MRI slices reached Dice 0.87 and IoU 0.77, beating published baselines, and a Gemini RAG pipeline drafts clinical reports (ROUGE-1 0.89, METEOR 0.90).", link: "publications.html" },

    { title: "Project: Brain Image Fusion (MFG-FuseNet)", keys: "brain fusion mri pet mfg fusenet elsevier",
      text: "He co-authored MFG-FuseNet, a CNN for MRI-PET brain image fusion, published in Biomedical Signal Processing and Control (Elsevier). It improved QAB/F by 30.5% over prior methods.", link: "https://www.sciencedirect.com/science/article/abs/pii/S1746809424011182" },

    { title: "Other projects", keys: "other projects stock telegram bot sleeping posture stress whatsapp attendance automation",
      text: "Other builds include a sleeping-posture stress detector with MediaPipe, a WhatsApp school attendance and fee notifier (Tkinter, Pandas, PyAutoGUI) and an n8n + Gemini stock chart analysis Telegram bot.", link: "publications.html" },

    { title: "Publications", keys: "publications papers research published journal ieee elsevier springer book chapter scholar how many",
      text: "He has 10 publications: Sugarcane Leaf Classification (Springer Sadhana), Flowing Asanas yoga posture detection (IEEE), Diabetes prediction and Tomato leaf disease (Adroid Journals), MFG-FuseNet brain image fusion (Elsevier BSPC), MobileNetV2 leaf disease (IEEE), Yawning detection (Elsevier ICECMSN), Deep Learning for Wearable Devices (Elsevier book chapter), seizure analysis (CRC Press book chapter) and Mango yield prediction with YOLOv11L + DenseNet121 (IEEE).", link: "publications.html" },

    { title: "Research interests", keys: "research interests areas focus healthcare biomedical medical wearable",
      text: "His research centres on healthcare and biomedical AI (epilepsy, cancer, brain imaging, wearables, seizure analysis), computer vision for agriculture, and trustworthy LLM agents." },

    { title: "Conference presentations", keys: "conference presentation presented isbi iisc ovarian cancer air quality talk",
      text: "He has presented Multi-Class Ovarian Cancer Classification at IEEE ISBI, Air Quality Prediction at IICAQM 2023 (IISc Bangalore), and the Mango yield prediction work." },

    { title: "Achievements & leadership", keys: "achievements awards leadership robotics club president prefect nptel resource person",
      text: "He was President of the Robotics Club at VIT Chennai (400+ members, 7+ departments), won Protothon 8.0, ranked Top 1% in NPTEL E-Business, served as Head Prefect in school, and was a Resource Person teaching deep learning to PhD scholars at Scholar's Gate." },

    { title: "Certifications", keys: "certifications certificates certified iit bombay nptel",
      text: "Advanced C++ Programming and Python Programming from IIT Bombay (2022), and E-Business from NPTEL (2023, Top 1%)." },

    { title: "Soft skills", keys: "soft skills teamwork team communication leadership personality strengths",
      text: "He is extremely curious about learning new things and enjoys working in a team. His resume highlights leadership, project and time management, communication, problem solving and cross-functional collaboration." },

    { title: "Languages", keys: "languages speak spoken english hindi telugu tamil arabic",
      text: "He speaks English, Telugu, Hindi, Tamil and some Arabic." }
  ],

  suggestions: [
    "What are his top skills?",
    "Does he know LangGraph?",
    "Tell me about TrialMatch",
    "Is he available for a co-op?",
    "What has he published?",
    "How do I contact him?"
  ]
};
