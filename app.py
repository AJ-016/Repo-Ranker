from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

GITHUB_TOKEN = "" # Add PAT for higher limits

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')

@app.get("/api/fetch/{username}")
async def fetch_repos(username: str):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    url = f"https://api.github.com/users/{username.lower()}/repos?per_page=100"
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="User not found")
    
    repos_data = []
    for r in response.json():
        if not r["fork"]:
            lang_res = requests.get(r["languages_url"], headers=headers)
            all_langs = ", ".join(list(lang_res.json().keys())) if lang_res.status_code == 200 else (r["language"] or "Misc")
            repos_data.append({
                "name": r["name"], "lang": all_langs, "url": r["html_url"],
                "desc": r["description"] or "Project description...", "stars": r["stargazers_count"]
            })
    return repos_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8005)