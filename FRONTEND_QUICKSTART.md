# Frontend Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on `http://localhost:5000`

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Available Pages

### Public Pages (No Login Required)
| Page | URL | Features |
|------|-----|----------|
| Landing | `/` | Hero, categories, trending products, testimonials |
| Product Listing | `/products` | Advanced filters, search, sorting, pagination |
| Product Details | `/products/[id]` | Images, reviews, Q&A, related products |
| Login | `/login` | Email/password authentication |
| Signup | `/signup` | Multi-step registration with role selection |

### Protected Pages (Requires Login)
| Page | URL | Features |
|------|-----|----------|
| Dashboard | `/dashboard` | User overview, orders, addresses, wallet |
| Shopping Cart | `/cart` | Cart items, coupon application |
| Checkout | `/checkout` | Address selection, payment method, confirmation |
| Order Tracking | `/orders/[id]` | Delivery timeline, partner info |

## 🧪 Testing the Frontend

### 1. Landing Page
```
Navigate to: http://localhost:3000/
- Check hero section, search bar
- Browse categories and trending products
- Scroll to testimonials and footer
```

### 2. Product Browsing
```
Navigate to: http://localhost:3000/products
- Use filters on left sidebar (price, rating, stock)
- Try different sort options
- Toggle between grid and list views
- Try pagination
```

### 3. Authentication Flow
```
Sign Up:
1. Go to http://localhost:3000/signup
2. Fill form with demo data:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Test123456
   - Select role: Buyer
3. Accept terms and click "Create Account"

Login:
1. Go to http://localhost:3000/login
2. Use same email/password
3. Check "Remember me" option
```

### 4. Shopping Flow
```
Add to Cart:
1. Browse products
2. Click "Add to Cart" on any product

View Cart:
1. Go to http://localhost:3000/cart
2. Adjust quantities
3. Try applying coupon: SAVE10

Checkout:
1. Click "Proceed to Checkout"
2. Enter delivery address
3. Select payment method
4. Review order and place
5. Get order confirmation
```

### 5. Order Tracking
```
Track Order:
1. Dashboard → View recent order
2. Click "View Details"
3. See delivery timeline and estimated date
```

## 🎨 Component Usage Examples

### Using the API Client
```javascript
import { apiClient } from '@/lib/api';

// Fetch products
const data = await apiClient.getProducts({ limit: 10 });

// Add to cart
await apiClient.addToCart('product-id', 2);

// Process payment
await apiClient.processPayment(paymentData);
```

### Using Zustand Stores
```javascript
import { useAuthStore, useCartStore } from '@/lib/store';

export function MyComponent() {
  const { user, login, logout } = useAuthStore();
  const { items, addToCart } = useCartStore();
  
  return (
    <>
      {user && <p>Logged in: {user.name}</p>}
      <button onClick={() => login(email, password)}>Login</button>
    </>
  );
}
```

### Using Utility Functions
```javascript
import { formatPrice, formatDate, validateEmail } from '@/lib/utils';

const price = formatPrice(5000); // ₹5,000
const date = formatDate('2024-01-15'); // 15 Jan 2024
const valid = validateEmail('test@example.com'); // true
```

## 🎨 Styling Guide

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: White/Gray-50 (light), Gray-900 (dark)

### Dark Mode
- All pages support dark mode
- Tailwind `dark:` classes used throughout
- Toggle in browser DevTools

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Authentication Flow

### Token Management
```javascript
// Token stored in localStorage
localStorage.getItem('authToken');
localStorage.getItem('refreshToken');

// Set in API client automatically
apiClient.setToken(token);

// Logout clears tokens
localStorage.removeItem('authToken');
```

### Protected Pages
```javascript
// Check auth on load
if (!token) {
  router.push('/login');
}

// Automatic redirect if unauthorized
```

## 🐛 Troubleshooting

### Issue: API Connection Failed
**Solution**: Ensure backend is running on port 5000
```bash
cd server
npm run dev
```

### Issue: Pages Loading Slowly
**Solution**: Clear Next.js cache and reinstall dependencies
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: Dark Mode Not Working
**Solution**: Check if `dark` class is on root element
```bash
# In layout.js
<html className="dark">
```

### Issue: Authentication Not Persisting
**Solution**: Check if token is saved to localStorage
```javascript
// In browser console
console.log(localStorage.getItem('authToken'));
```

## 📊 API Response Format

All endpoints return:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔗 Available API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Products
- `GET /products` - List products with filters
- `GET /products/trending` - Trending products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Product details

### Orders
- `POST /orders` - Create order
- `GET /orders` - User orders
- `GET /orders/:id` - Order details

### Cart
- `POST /cart` - Add to cart
- `GET /cart` - Get cart
- `PUT /cart/:id` - Update item quantity
- `DELETE /cart/:id` - Remove item

## 📝 Environment Variables

Create `.env.local` in client directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🆘 Need Help?

1. Check browser console for errors
2. Verify API responses in Network tab
3. Test with demo data provided above
4. Review component implementation in source files

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**Happy testing! 🎉**
