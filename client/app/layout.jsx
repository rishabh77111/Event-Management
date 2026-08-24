import './globals.css';
import Navbar from '../components/common/navbar';
import { AuthProvider } from '../providers/auth.provider';

export const metadata = {
  title: 'Eventora',
  description: 'Discover and book events with Eventora.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
