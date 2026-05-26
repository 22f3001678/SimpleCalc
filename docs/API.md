# API Documentation

## Overview

This document describes the backend API endpoints used in the SimpleCalc project.

Base URL:

```txt
http://localhost:5000/api
```

---

# Endpoints

## Health Check

### GET `/health`

Checks whether the backend server is running.

### Response

```json
{
  "status": "ok"
}
```

---

## Evaluate Expression

### POST `/calculator/evaluate`

Evaluates a mathematical expression.

### Request Body

```json
{
  "expression": "2+2*5"
}
```

### Response

```json
{
  "expression": "2+2*5",
  "result": 12
}
```

---

## Save Calculation History

### POST `/history`

Stores a calculation entry.

### Request Body

```json
{
  "expression": "5*5",
  "result": 25
}
```

### Response

```json
{
  "message": "History saved successfully"
}
```

---

## Get Calculation History

### GET `/history`

Returns stored calculation history.

### Response

```json
[
  {
    "expression": "5*5",
    "result": 25
  }
]
```

---

# Error Response Format

```json
{
  "error": "Invalid expression"
}
```

---

# Future Improvements

- Authentication
- Persistent database storage
- Graph plotting API
- Expression parsing engine
- Rate limiting
- API versioning