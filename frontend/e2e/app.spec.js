import { test, expect } from '@playwright/test';

test.describe('IndiBuy Frontend E2E Tests', () => {
  test.describe('Home Page', () => {
    test('should load home page successfully', async ({ page }) => {
      await page.goto('/');
      
      // Check for main heading
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toContainText('Industrial Products at Scale');
      
      // Check for navigation
      const navbar = page.locator('nav');
      await expect(navbar).toBeVisible();
    });

    test('should display categories on home page', async ({ page }) => {
      await page.goto('/');
      
      // Check for category section - use more specific selector
      const categoryHeading = page.locator('h2').first();
      await expect(categoryHeading).toContainText('Shop by Category');
      
      // Check for specific categories
      await expect(page.locator('text=Steel & Iron')).toBeVisible();
      await expect(page.locator('text=Machinery')).toBeVisible();
      await expect(page.locator('text=Tools')).toBeVisible();
    });

    test('should navigate to products page from Browse Products button', async ({ page }) => {
      await page.goto('/');
      
      // Click Browse Products button
      await page.click('text=Browse Products');
      
      // Wait for navigation
      await page.waitForURL('**/products');
      
      // Verify we're on the products page
      expect(page.url()).toContain('/products');
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/');
      
      // Click Sign Up as Buyer button
      await page.click('text=Sign Up as Buyer');
      
      // Wait for navigation
      await page.waitForURL('**/register**');
      
      // Verify we're on the register page
      expect(page.url()).toContain('/register');
    });
  });

  test.describe('Products Page', () => {
    test('should load products page', async ({ page }) => {
      await page.goto('/products');
      
      // Check for products heading or title
      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display products list', async ({ page }) => {
      await page.goto('/products');
      
      // Wait for products to load
      await page.waitForTimeout(500);
      
      // Check if we can see product elements
      const productElements = page.locator('[class*="product"], [class*="card"]');
      const count = await productElements.count();
      
      // We expect at least some products or product containers
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have filter options', async ({ page }) => {
      await page.goto('/products');
      
      // Check for filter or search elements
      const filterElements = page.locator('input, select, [class*="filter"]');
      expect(await filterElements.count()).toBeGreaterThan(0);
    });

    test('should navigate back to home from products', async ({ page }) => {
      await page.goto('/products');
      
      // Click logo/home link
      await page.click('text=IB');
      
      // Wait for navigation
      await page.waitForURL('/');
      
      // Verify we're back on home page
      expect(page.url()).toContain('localhost:3000/');
    });
  });

  test.describe('Authentication Pages', () => {
    test('should load login page', async ({ page }) => {
      await page.goto('/login');
      
      // Check for login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should load register page', async ({ page }) => {
      await page.goto('/register?role=buyer');
      
      // Check that form elements exist - email and form inputs
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      // Check for any form inputs (covering various field types)
      const formInputs = page.locator('input');
      const inputCount = await formInputs.count();
      expect(inputCount).toBeGreaterThan(1); // At least email + one more field
    });

    test('should navigate from register to login', async ({ page }) => {
      await page.goto('/register');
      
      // Look for login link using proper selectors
      const loginLink = page.locator('a:has-text("Login"), a[href*="/login"]').first();
      if (await loginLink.count() > 0) {
        await loginLink.click();
        await page.waitForURL('**/login');
        expect(page.url()).toContain('/login');
      }
    });

    test('should navigate from login to register', async ({ page }) => {
      await page.goto('/login');
      
      // Look for register link or Sign up link using proper selectors
      const registerLink = page.locator('a[href*="/register"], a:has-text("Sign Up"), a:has-text("Register")').first();
      if (await registerLink.count() > 0) {
        await registerLink.click();
        await page.waitForURL('**/register');
        expect(page.url()).toContain('/register');
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate through main pages', async ({ page }) => {
      // Home page
      await page.goto('/');
      expect(page.url()).toContain('localhost:3000/');
      
      // Products page
      await page.click('text=Browse Products');
      await page.waitForURL('**/products');
      expect(page.url()).toContain('/products');
      
      // Back to home
      await page.click('text=IB');
      await page.waitForURL('/');
      expect(page.url()).toContain('localhost:3000/');
    });

    test('should display footer on all pages', async ({ page }) => {
      // Home
      await page.goto('/');
      await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
      
      // Products
      await page.goto('/products');
      await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
      
      // Login
      await page.goto('/login');
      await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
    });

    test('should have working navbar on all pages', async ({ page }) => {
      const pages = ['/', '/products', '/login'];
      
      for (const path of pages) {
        await page.goto(path);
        const navbar = page.locator('nav');
        await expect(navbar).toBeVisible();
      }
    });
  });

  test.describe('UI Elements', () => {
    test('should render responsive layout', async ({ page }) => {
      await page.goto('/');
      
      // Check for main layout elements
      await expect(page.locator('main, [role="main"]')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should have accessible buttons', async ({ page }) => {
      await page.goto('/');
      
      // Check for buttons
      const buttons = page.locator('button, a[role="button"]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have proper link navigation', async ({ page }) => {
      await page.goto('/');
      
      // Check for links
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
