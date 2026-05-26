## ADDED Requirements

### Requirement: Calculate expression endpoint
The system SHALL provide POST /api/calculate endpoint for expression evaluation.

#### Scenario: Submit expression for calculation
- **WHEN** frontend sends POST request with { expression: "5 + 3" }
- **THEN** backend evaluates and returns { result: 8, expression: "5 + 3" }

#### Scenario: Handle invalid expression
- **WHEN** frontend sends invalid expression "5 ++"
- **THEN** backend returns error response with status 400 and error message

### Requirement: Get calculation history endpoint
The system SHALL provide GET /api/history endpoint to retrieve stored calculations.

#### Scenario: Retrieve all history
- **WHEN** frontend sends GET /api/history
- **THEN** backend returns array of calculation objects with expression, result, timestamp

#### Scenario: History returns recent items first
- **WHEN** retrieving history
- **THEN** calculations are returned in reverse chronological order (newest first)

### Requirement: Save calculation to history endpoint
The system SHALL provide POST /api/history endpoint to add calculation to history.

#### Scenario: Save calculation
- **WHEN** frontend sends POST /api/history with { expression: "5+3", result: 8 }
- **THEN** backend saves calculation and returns confirmation with ID and timestamp

### Requirement: Delete history entry endpoint
The system SHALL provide DELETE /api/history/:id endpoint to remove specific calculations.

#### Scenario: Delete calculation entry
- **WHEN** frontend sends DELETE /api/history/123
- **THEN** backend removes that entry and returns 200 OK response

### Requirement: Clear all history endpoint
The system SHALL provide DELETE /api/history endpoint (without ID) to clear entire history.

#### Scenario: Clear all history
- **WHEN** frontend sends DELETE /api/history with confirm flag
- **THEN** backend clears all history and returns success response

### Requirement: Get user preferences endpoint
The system SHALL provide GET /api/config endpoint for user settings.

#### Scenario: Retrieve preferences
- **WHEN** frontend sends GET /api/config
- **THEN** backend returns { theme: "dark", decimalPlaces: 10, angleMode: "degrees" }

### Requirement: Update preferences endpoint
The system SHALL provide PUT /api/config endpoint to save user preferences.

#### Scenario: Save theme preference
- **WHEN** frontend sends PUT /api/config with { theme: "light" }
- **THEN** backend saves preference and returns confirmation

### Requirement: Input validation on endpoints
The system SHALL validate all input on every endpoint.

#### Scenario: Validate expression input
- **WHEN** expression contains invalid characters
- **THEN** endpoint returns 400 error with validation message

#### Scenario: Validate configuration values
- **WHEN** invalid theme value is submitted
- **THEN** endpoint rejects and returns error

### Requirement: Error response consistency
The system SHALL return consistent error response format across all endpoints.

#### Scenario: Error response structure
- **WHEN** any endpoint error occurs
- **THEN** response includes { error: "message", code: "ERROR_CODE", status: 400 }

### Requirement: CORS configuration
The system SHALL allow frontend to make cross-origin requests safely.

#### Scenario: Frontend CORS requests
- **WHEN** frontend makes request from different origin
- **THEN** CORS headers are properly set to allow frontend access

### Requirement: Response status codes
The system SHALL use appropriate HTTP status codes for all responses.

#### Scenario: Successful calculation
- **WHEN** calculation succeeds
- **THEN** response has status 200

#### Scenario: Bad request
- **WHEN** expression is malformed
- **THEN** response has status 400

#### Scenario: Server error
- **WHEN** unexpected error occurs
- **THEN** response has status 500 with error details

### Requirement: Rate limiting (optional)
The system MAY include rate limiting on calculation endpoint.

#### Scenario: Prevent excessive requests
- **WHEN** user makes more than X requests per minute
- **THEN** system returns 429 Too Many Requests
