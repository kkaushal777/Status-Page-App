import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize the toast hook


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        organization_name: formData.get('organization_name'),
      };

      await register(userData);
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
        variant: "default",
      });
      navigate('/login');
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input 
            type="password" 
            id="password" 
            name="password" 
            required 
          />
        </div>
        <div>
          <label htmlFor="organization_name">Organization Name</label>
          <Input 
            type="text" 
            id="organization_name" 
            name="organization_name" 
            required 
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  );
}