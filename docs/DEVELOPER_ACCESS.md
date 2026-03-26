# Developer access to the Google Cloud project

If you were added to the **cs506-flight-tracker** GCP project, follow these steps to access the project and the VM from your own machine.

---

## 1. Install the Google Cloud SDK (gcloud)

- **macOS (Homebrew):** `brew install --cask google-cloud-sdk`
- **Windows:** [Install from installer](https://cloud.google.com/sdk/docs/install)
- **Linux:** [Install from package](https://cloud.google.com/sdk/docs/install#linux)

After install, open a new terminal and run `gcloud version` to confirm.

---

## 2. Log in and select the project

```bash
gcloud auth login
```

A browser window opens; sign in with the **Google account that was added to the project** (the same email the project owner used in IAM).

Then set the active project:

```bash
gcloud config set project cs506-flight-tracker
```

Check that it’s set:

```bash
gcloud config get-value project
```

You should see `cs506-flight-tracker`.

---

## 3. Open the project in the Cloud Console (optional)

- Go to [Google Cloud Console](https://console.cloud.google.com).
- Make sure you’re signed in with the same Google account.
- Use the project dropdown at the top to select **cs506-flight-tracker**.

You can then browse VM instances, IAM, logs, etc. in the web UI.

---

## 4. SSH into the VM

From your laptop (no need to be on the VM already):

```bash
gcloud compute ssh flight-tracker-vm --zone=us-central1-a --project=cs506-flight-tracker
```

Or, if you already ran `gcloud config set project cs506-flight-tracker`:

```bash
gcloud compute ssh flight-tracker-vm --zone=us-central1-a
```

The first time you connect, gcloud may prompt to create a key or download tools; accept if asked. When you’re connected, your prompt will show you’re on the VM (e.g. `username@flight-tracker-vm`).

To exit SSH: type `exit` or press Ctrl+D.

---

## 5. Using the backend API (no GCP access needed)

If you only need to call the backend (e.g. from the frontend or Postman), you don’t need gcloud or project access. Ask the team for the VM’s **external IP**; the backend base URL is:

```
http://<VM_EXTERNAL_IP>:8080
```

Example: `http://34.134.223.201:8080/api/teams` (replace with the current IP if it changes).

The React app’s default base URL is `http://<VM_EXTERNAL_IP>:8080/api` (see `frontend/.env.example` and `DEFAULT_API_BASE_URL` in `frontend/src/utils/constants.js`). Override with `REACT_APP_API_BASE_URL` for a local Docker backend (`http://localhost:8080/api`).

---

## Quick reference

| What you want to do        | What to run / use |
|---------------------------|--------------------|
| Log in to Google Cloud    | `gcloud auth login` |
| Use project cs506-flight-tracker | `gcloud config set project cs506-flight-tracker` |
| SSH into the VM           | `gcloud compute ssh flight-tracker-vm --zone=us-central1-a` |
| Open project in browser   | [console.cloud.google.com](https://console.cloud.google.com) → select **cs506-flight-tracker** |
| Call the backend API      | `http://<VM_IP>:8080` (get IP from the team) |
