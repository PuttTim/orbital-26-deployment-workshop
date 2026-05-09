---
layout: cover
transition: view-transition
---

<h1 style="view-transition-name: deck-title">End to End Deployment</h1>

Part 1


---
src: ./part-1/presenter-introduction.md
---

---
---
# Welcome, new intern!
<!-- Congratulations! You've just been hired as new unpaid intern at Wrapper.ai, Singapore's premier AI B2B Web3 Agentic Deep Tech SaaS! -->

![](../fake-slack-ai-slop.png)



---
layout: section
---

## So, what does it mean to deploy an app?

---
---


# How do most apps work?

<AppSpectrum />

---
layout: two-cols-header
---

# The Client-Server model

Your app (the **client**) talks to a **server** over the internet.

::left::

```mermaid {scale: 0.7}
architecture-beta
    group backend(cloud)[Cloud]

    service web(internet)[Web App]
    service mobile(internet)[Mobile App]
    service net(cloud)[Internet]
    service api(server)[API Server] in backend
    service db(database)[Database] in backend
    service storage(disk)[File Storage] in backend

    web:B -- T:net
    mobile:T -- B:net
    net:R -- L:api
    api:R -- L:db
    api:B -- T:storage
```

::right::

- **Client**: the browser tab or mobile app the user sees
- **Internet**: how the client reaches your server
- **API Server**: runs your backend code and exposes an API (e.g Hono, Express, FastAPI)
- **Database**: structured state (e.g PostgreSQL, MongoDB)
- **File Storage**: blobs like images, PDFs, videos (e.g S3)

---
layout: image
image: ./the-cloud.png
backgroundSize: contain
---

---
---

# Deployment Environments
<!-- todo make the deployment slides better -->
## Dev
- Your computer!
- Your working copy of the code
- Uses simulated data

---
---
# Deployment Environments
## Staging
- A replica of the production environment
- Located on a remote server
- A sandbox environment for testing new features before deploying

---
---
# Deployment Environments
## Production
- The live, public version of your app
- Located on a remote server
- What the end users see

---
layout: section
---
## How code gets to production

---
---
# The software development lifecycle
<!-- lifecycle from dev to production -->

- A repeating cycle, not a one-shot project
- Each phase happens in a specific environment: **dev → staging → prod**
- Bugs caught earlier (in dev or staging) are cheaper than bugs in prod

<div class="flex justify-center mt-4">

```mermaid {scale: 0.8}
flowchart LR
    subgraph DEV["<b>DEV</b> (your machine)"]
        direction LR
        P([PLAN]) --> D([DESIGN]) --> C([CODE]) --> B([BUILD]) --> T([TEST])
    end
    subgraph STG["<b>STAGING</b> (replica server)"]
        direction LR
        R([RELEASE])
    end
    subgraph PROD["<b>PRODUCTION</b> (live users)"]
        direction LR
        O([DEPLOY]) --> M([MONITOR])
    end
    T ==> R ==> O
    M -.feedback.-> P

    classDef devBox fill:#1a3a52,color:#fff,stroke:#0f2538,stroke-width:2px
    classDef stgBox fill:#8b6914,color:#fff,stroke:#5a4410,stroke-width:2px
    classDef prodBox fill:#c0392b,color:#fff,stroke:#8b2820,stroke-width:2px
    classDef phase fill:#a8c8d8,color:#0f2538,stroke:#7ba8bd,stroke-width:1px,font-weight:bold

    class DEV devBox
    class STG stgBox
    class PROD prodBox
    class P,D,C,B,T,R,O,M phase
    linkStyle default stroke:#999,stroke-width:2px
```

</div>

---
---
# CI/CD
- Objective: streamline the deployment process to minimise human intervention
- Continuous Integration (CI): automation of building and testing
- Continuous Delivery/Deployment (CD): automation of deploying to production
- Commonly used tools: Jenkins, GitLab CI, GitHub Actions
<div class="flex justify-center mt-6">

```mermaid {scale: 0.9}
flowchart LR
    subgraph CI["<b>CONTINUOUS INTEGRATION</b>"]
        direction LR
        B([BUILD]) --> T([TEST]) --> M([MERGE])
    end
    subgraph CDel["<b>CONTINUOUS DELIVERY</b>"]
        R("AUTOMATICALLY<br/>RELEASE TO<br/>REPOSITORY")
    end
    subgraph CDep["<b>CONTINUOUS DEPLOYMENT</b>"]
        D("AUTOMATICALLY<br/>DEPLOY TO<br/>PRODUCTION")
    end
    M ==> R ==> D

    classDef ciBox fill:#1a3a52,color:#fff,stroke:#0f2538,stroke-width:2px
    classDef ciStep fill:#a8c8d8,color:#0f2538,stroke:#7ba8bd,stroke-width:1px,font-weight:bold
    classDef delBox fill:#8b2020,color:#fff,stroke:#5a1414,stroke-width:2px,font-weight:bold
    classDef depBox fill:#c0392b,color:#fff,stroke:#8b2820,stroke-width:2px,font-weight:bold

    class CI ciBox
    class B,T,M ciStep
    class CDel,R delBox
    class CDep,D depBox

    linkStyle default stroke:#999,stroke-width:2px
```

</div>

---
---
# How CI/CD fits into the software development lifecycle

- **You** plan, design, and code on your **dev** machine
- **CI** runs build & test on every push
- **CD** ships to **staging** automatically, then to **prod** on merge
- Each environment is a checkpoint: dev → staging → prod

<div class="flex justify-center mt-4">

```mermaid {scale: 0.7}
flowchart LR
    subgraph DEV["<b>DEV</b> — you"]
        direction LR
        P([PLAN]) --> D([DESIGN]) --> C([CODE])
    end
    subgraph CI["<b>CI</b> — runs on every push"]
        direction LR
        B([BUILD]) --> T([TEST])
    end
    subgraph STG["<b>STAGING</b> — CD"]
        direction LR
        R([RELEASE])
    end
    subgraph PROD["<b>PROD</b> — CD"]
        direction LR
        O([DEPLOY]) --> M([MONITOR])
    end
    C ==> B
    T ==> R
    R ==> O
    M -.feedback.-> P

    classDef devBox fill:#1a3a52,color:#fff,stroke:#0f2538,stroke-width:2px
    classDef ciBox fill:#8b2020,color:#fff,stroke:#5a1414,stroke-width:2px
    classDef stgBox fill:#8b6914,color:#fff,stroke:#5a4410,stroke-width:2px
    classDef prodBox fill:#c0392b,color:#fff,stroke:#8b2820,stroke-width:2px
    classDef phase fill:#a8c8d8,color:#0f2538,stroke:#7ba8bd,stroke-width:1px,font-weight:bold

    class DEV devBox
    class CI ciBox
    class STG stgBox
    class PROD prodBox
    class P,D,C,B,T,R,O,M phase
    linkStyle default stroke:#999,stroke-width:2px
```

</div>

---
layout: quote
---
# But boss, it works on my machine! 


---
layout: two-cols-header
---
# Containerisation
::left::
- Packages the application, its dependencies, and the runtime environment into a single container
- Runs the container on any machine with a compatible runtime
- More portable, easier to deploy, and less resource-intensive than virtual machines
- Going to go more in depth next week!
::right::
![Containerisation](../docker-meme.jpg)

---
layout: two-cols-header
---
# Going "Serverless"

::left::
- You supply the code, the platform handles the environment
- Pros: 
  - no need to manage infrastructure
  - easy scaling
- Cons:
  - no control over the environment
  - vendor lock-in
- e.g AWS Lambda, Firebase Functions


::right::
![Serverless](../serverless.jpeg)

---
layout: section
---
## Cloudflare
We're not sponsored btw

---
---
# Bing shilling time
- Cloudflare is
  - cheap
  - fast
  - easy
- We're going to use the following:
  - Cloudflare Workers (serverless!)
  - Cloudflare R2 (file storage!)
- They have way too many services to list here