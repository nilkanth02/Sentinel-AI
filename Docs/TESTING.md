# SentinelAI Backend Testing Guide

## 🎯 Overview

This document provides comprehensive guidance for testing the SentinelAI backend. Our test suite ensures production-ready code quality, reliability, and maintainability.

## 📦 Installation

### 1. Set up virtual environment

```bash
cd Sentinel-AI/Backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\Activate

# Linux/Mac:
source .venv/bin/activate
```

### 2. Install dependencies

```bash
# Install production dependencies
pip install fastapi uvicorn sqlalchemy pydantic numpy sentence-transformers torch transformers scikit-learn

# Install test dependencies
pip install -r requirements-test.txt
```

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=app --cov-report=html
```

### Using the Test Runner Script

```bash
# Run all tests with coverage
python run_tests.py --all

# Run only unit tests
python run_tests.py --unit

# Run only integration tests
python run_tests.py --integration

# Run specific module
python run_tests.py --module api

# Run with code quality checks
python run_tests.py --quality

# Run tests in parallel (faster)
python run_tests.py --fast
```

## 📊 Test Structure

```
tests/
├── __init__.py              # Test package initialization
├── conftest.py              # Shared fixtures and configuration
├── test_api.py              # API endpoint tests
├── test_monitors.py         # Monitor module tests
├── test_scoring.py          # Scoring module tests
├── test_policy.py           # Policy engine tests
├── test_database.py         # Database tests
├── test_integration.py      # Integration tests
└── README.md                # Test documentation
```

## 🧪 Test Categories

### 1. Unit Tests

Test individual components in isolation.

```bash
# Run all unit tests
pytest tests/test_monitors.py tests/test_scoring.py tests/test_policy.py
```

**Coverage:**
- Prompt anomaly detection
- Jailbreak detection
- Output risk scoring
- Risk aggregation
- Policy decision making

### 2. API Tests

Test FastAPI endpoints and request/response handling.

```bash
# Run API tests
pytest tests/test_api.py
```

**Coverage:**
- Health check endpoint
- Analysis endpoint
- Baseline management
- Request validation
- Error handling

### 3. Database Tests

Test database models and CRUD operations.

```bash
# Run database tests
pytest tests/test_database.py
```

**Coverage:**
- Model creation
- Data persistence
- CRUD operations
- Baseline management
- Timestamp handling

### 4. Integration Tests

Test complete workflows and component interactions.

```bash
# Run integration tests
pytest tests/test_integration.py
```

**Coverage:**
- End-to-end workflows
- Multi-component interactions
- Error handling
- Edge cases

## 📈 Coverage Requirements

### Minimum Coverage Targets

- **Overall**: 80%
- **API Routes**: 90%
- **Risk Scoring**: 90%
- **Policy Engine**: 85%
- **Database**: 80%

### Generate Coverage Report

```bash
# Terminal report
pytest --cov=app --cov-report=term-missing

# HTML report (opens in browser)
pytest --cov=app --cov-report=html
# Then open: htmlcov/index.html

# XML report (for CI/CD)
pytest --cov=app --cov-report=xml
```

## ✅ Test Checklist for Contributors

Before submitting a pull request:

- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Coverage is maintained (>80%)
- [ ] Code is formatted with Black
- [ ] Imports are sorted with isort
- [ ] No linting errors (flake8)
- [ ] Documentation is updated

### Run Complete Check

```bash
# 1. Format code
black app/ tests/

# 2. Sort imports
isort app/ tests/

# 3. Run linter
flake8 app/ tests/ --max-line-length=100

# 4. Run tests with coverage
pytest --cov=app --cov-report=term-missing

# 5. Check coverage threshold
pytest --cov=app --cov-fail-under=80
```

## 🔍 Debugging Tests

### Run specific test

```bash
# Run single test file
pytest tests/test_api.py

# Run single test class
pytest tests/test_api.py::TestHealthEndpoint

# Run single test method
pytest tests/test_api.py::TestHealthEndpoint::test_health_check_returns_ok
```

### Debug with print statements

```bash
# Show print output
pytest -s

# Show print output with verbose
pytest -sv
```

### Debug with breakpoints

```bash
# Drop into debugger on failure
pytest --pdb

# Drop into debugger on first failure
pytest -x --pdb
```

### Re-run failed tests

```bash
# Run only failed tests from last run
pytest --lf

# Run failed tests first, then others
pytest --ff
```

## 🎨 Code Quality

### Formatting

```bash
# Check formatting
black --check app/ tests/

# Auto-format
black app/ tests/
```

### Import Sorting

```bash
# Check import order
isort --check-only app/ tests/

# Auto-sort imports
isort app/ tests/
```

### Linting

```bash
# Run flake8
flake8 app/ tests/ --max-line-length=100

# Show statistics
flake8 app/ tests/ --max-line-length=100 --statistics
```

## 🚦 Continuous Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Nightly builds

### CI Pipeline

1. **Setup**: Install dependencies
2. **Test**: Run full test suite
3. **Coverage**: Generate coverage report
4. **Quality**: Check code formatting and linting
5. **Report**: Upload results

## 📝 Writing New Tests

### Test Template

```python
import pytest

class TestYourFeature:
    """Tests for your feature."""
    
    def test_basic_case(self):
        """Test the basic use case."""
        # Arrange
        input_data = "test input"
        expected = "expected output"
        
        # Act
        result = your_function(input_data)
        
        # Assert
        assert result == expected
    
    def test_edge_case(self):
        """Test edge case handling."""
        # Test with empty input
        result = your_function("")
        assert result is not None
    
    def test_error_handling(self):
        """Test error handling."""
        with pytest.raises(ValueError):
            your_function(invalid_input)
```

### Using Fixtures

```python
def test_with_client(client):
    """Test using the test client fixture."""
    response = client.get("/health")
    assert response.status_code == 200

def test_with_database(test_db):
    """Test using the test database fixture."""
    # Database operations here
    pass

def test_with_samples(sample_safe_prompt, sample_safe_response):
    """Test using sample data fixtures."""
    # Use sample data
    pass
```

## 🐛 Common Issues

### Issue: Import errors

**Solution**: Ensure you're in the Backend directory and virtual environment is activated.

```bash
cd Sentinel-AI/Backend
.venv\Scripts\Activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

### Issue: Database errors

**Solution**: Tests use in-memory SQLite, no setup needed. If issues persist, check SQLAlchemy installation.

### Issue: Slow tests

**Solution**: Run tests in parallel.

```bash
pytest -n auto  # Uses all CPU cores
```

### Issue: Coverage too low

**Solution**: Add tests for uncovered code.

```bash
# See which lines are not covered
pytest --cov=app --cov-report=term-missing
```

## 📚 Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Coverage.py](https://coverage.readthedocs.io/)
- [Black Code Formatter](https://black.readthedocs.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📞 Support

For testing issues:
1. Check this documentation
2. Review test output carefully
3. Check GitHub Issues
4. Create new issue with details

---

**Happy Testing! 🎉**

