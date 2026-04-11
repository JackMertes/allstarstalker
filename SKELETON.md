# Walking Skeleton — Historical Reference

This document describes the Walking Skeleton built during Sprint 0/1. It is a historical artifact; the production system has since grown significantly beyond what is described here.

---

## Purpose

The Walking Skeleton was a minimal proof-of-concept to confirm that the front end, back end, and database could communicate end-to-end. It was not intended to be a product.

## What Was Built

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React (Create React App) | Simple UI to display data from the API |
| Backend | Java Spring Boot REST API | Single endpoint returning data from the database |
| Database | MySQL running in Docker | Single table storing tracked items |

The skeleton demonstrated a full round-trip: data entered or stored in MySQL was retrievable through the Spring Boot API and displayed in the React frontend — confirming the chosen tech stack could work together.

## What Replaced It

The full application — Star Stalker — is an NBA team flight tracker built on the same stack. See [`README.md`](README.md) for current setup, architecture, and documentation links.
