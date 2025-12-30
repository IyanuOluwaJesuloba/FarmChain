'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { blockchainService } from '@/lib/blockchain';
// Temporarily removed i18n for client-side compatibility
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  phone: string;
  location: string;
  farmSize: number;
  crops: string[];
  landDoc?: File;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', location: '', farmSize: 0, crops: [] });
  const [language, setLanguage] = useState('en');
  const [suggestedCrops, setSuggestedCrops] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (step === 3) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Simple AI suggestion based on location (expand with API)
        const crops = lat > 0 ? ['Maize', 'Millet'] : ['Cassava', 'Cocoa']; // North/South Nigeria
        setSuggestedCrops(crops);
        setFormData(prev => ({ ...prev, location: `${lat},${lon}` }));
      });
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCropsChange = (crop: string) => {
    const crops = formData.crops.includes(crop) ? formData.crops.filter(c => c !== crop) : [...formData.crops, crop];
    setFormData({ ...formData, crops });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFormData({ ...formData, landDoc: e.target.files[0] });
  };

  const handleRegister = async () => {
    try {
      // Connect wallet first
      await blockchainService.connectWallet();
      
      // Register farmer on blockchain
      const txHash = await blockchainService.registerFarmer(
        formData.name, 
        formData.location, 
        formData.crops
      );
      
      // For now, skip IPFS upload and backend registration
      // You can implement these later when you have the backend ready
      console.log('Farmer registered successfully! Transaction:', txHash);
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const nextStep = () => setStep(step + 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen hero-bg flex flex-col items-center justify-center p-4 text-white">
      <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className="text-3xl font-bold mb-6">Join FarmChain Nigeria</motion.h1>
      {step === 1 && (
        <motion.select initial={{ scale: 0.9 }} animate={{ scale: 1 }} value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 border rounded-lg mb-4 bg-white/20 text-white">
          <option value="en">English</option>
          <option value="ha">Hausa</option>
          <option value="yo">Yoruba</option>
          <option value="ig">Igbo</option>
        </motion.select>
      )}
      {step === 2 && (
        <motion.input initial={{ x: 100 }} animate={{ x: 0 }} type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4 bg-white/20 text-white" />
      )}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white/20 text-white" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white/20 text-white" />
          <input type="number" name="farmSize" placeholder="Farm Size (hectares)" value={formData.farmSize} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white/20 text-white" />
          <div className="mb-4">
            <label className="block mb-2">Select Crops (Suggestions: {suggestedCrops.join(', ')})</label>
            {['Maize', 'Cassava', 'Millet', 'Cocoa'].map(crop => (
              <motion.div key={crop} whileHover={{ scale: 1.05 }} className="flex items-center">
                <input type="checkbox" value={crop} onChange={() => handleCropsChange(crop)} className="mr-2" /> {crop}
              </motion.div>
            ))}
          </div>
          <input type="file" onChange={handleFileChange} className="w-full mb-4 text-white" />
        </motion.div>
      )}
      {step === 4 && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={handleRegister} className="bg-yellow-500 text-green-900 p-3 rounded-lg w-full font-bold hover:bg-yellow-400 transition">
          Connect Wallet & Register
        </motion.button>
      )}
      <button onClick={nextStep} className="mt-4 bg-white text-green-600 p-3 rounded-lg w-full font-bold">Next</button>
      {/* Voice Support */}
      <button onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance('Join FarmChain Nigeria'))} className="mt-2 text-sm">🔊 Voice Guide</button>
    </motion.div>
  );
}
