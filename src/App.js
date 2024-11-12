import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  MessageSquare,
  ShoppingCart,
  Shield,
  Zap,
  Sword,
  Crosshair,
  Sparkles,
  Droplet,
  ArrowLeft,
} from 'lucide-react';

import CheckoutForm from './components/CheckoutForm';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';

// Cargar Stripe con tu clave pública desde variables de entorno
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Obtener la URL del backend desde variables de entorno
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const gooPacks = {
  G1: {
    name: 'Small Goo Pack',
    price: 5,
    amount: 500,
    color: 'bg-green-500',
  },
  G2: {
    name: 'Medium Goo Pack',
    price: 10,
    amount: 1000,
    color: 'bg-blue-500',
  },
  G3: {
    name: 'Large Goo Pack',
    price: 20,
    amount: 2000,
    color: 'bg-purple-500',
  },
};

const products = {
  A1: {
    name: 'Tier 1 VIP',
    price: 600,
    description:
      '2 MP5 Halo kits, 4 stacks of meds, 5k stone, 5k wood, 2k metal, 1 Hazmat suit',
    icon: <Shield className="w-8 h-8" />,
    color: 'bg-yellow-500',
  },
  A2: {
    name: 'Tier 2',
    price: 1200,
    description:
      '5 MP5s, 4 Hazmat suits, 1 full Road Sign armor kit, 3 stacks of ammo, 5 Halos, 15k stone, 15k wood, 5k metal, 500 HQM',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-green-500',
  },
  B1: {
    name: 'Tier 3',
    price: 1500,
    description:
      '5 MP5s, 1 Hazmat suit, 2 full Metal armor kits, 2 AKs, 2 rows of stims, 10 blackberries, 30k stone, 30k wood, 20k metal, 1k HQM, 2 stacks of 5.56 ammo',
    icon: <Sword className="w-8 h-8" />,
    color: 'bg-blue-500',
  },
  B2: {
    name: 'Tier 4',
    price: 2000,
    description:
      '4 full Metal armor kits, 4 AKs, 2 rows of stims, 30k stone, 30k wood, 25k metal, 1k HQM, 4 stacks of 5.56 ammo, 1 M2, 1 L96',
    icon: <Crosshair className="w-8 h-8" />,
    color: 'bg-purple-500',
  },
  C1: {
    name: 'Normal VIP',
    price: 300,
    description: 'VIP Access',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'bg-pink-500',
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showGooRecharge, setShowGooRecharge] = useState(false);
  const [selectedGooPack, setSelectedGooPack] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = (userId) => {
    axios
      .get(`${BACKEND_URL}/api/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setPurchaseMessage('Error fetching user data.');
      });
  };

  const handleDiscordLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/discord`;
  };

  const handleProductSelect = (productCode) => {
    setSelectedProduct(productCode);
    setInputCode(productCode);
    setShowGooRecharge(false);
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value.toUpperCase());
  };

  const handlePurchase = () => {
    if (!user) {
      setPurchaseMessage('Please log in with Discord before making a purchase.');
      return;
    }
    const selectedItem = products[inputCode];
    if (selectedItem) {
      axios
        .post(`${BACKEND_URL}/api/purchase/product`, {
          discordId: user.discordId,
          productCode: inputCode,
          price: selectedItem.price,
        })
        .then((response) => {
          setUser((prevUser) => ({
            ...prevUser,
            gooBalance: prevUser.gooBalance - selectedItem.price,
          }));
          setPurchaseMessage(`Purchase successful! ${user.username} bought ${selectedItem.name}.`);
        })
        .catch((error) => {
          console.error('Error purchasing product:', error);
          setPurchaseMessage(error.response?.data?.error || 'Error purchasing product.');
        });
    } else {
      setPurchaseMessage('Invalid product code. Please try again.');
    }
    setSelectedProduct('');
    setInputCode('');
  };

  const toggleGooRecharge = () => {
    setShowGooRecharge((prev) => !prev);
    setSelectedProduct('');
    setInputCode('');
  };

  const handleGooPackPurchase = (packCode) => {
    if (!user) {
      setPurchaseMessage('Please log in with Discord before making a purchase.');
      return;
    }
    const selectedPack = gooPacks[packCode];
    if (selectedPack) {
      setSelectedGooPack(selectedPack);
    }
  };

  const refreshUserData = () => {
    if (user && user.discordId) {
      fetchUserData(user.discordId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col items-center">
        <h1
          className="text-4xl font-bold mb-8 text-center text-cyan-400"
          style={{ textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }}
        >
          CNQR Gaming Vending Machine
        </h1>

        {!user ? (
          <Button
            onClick={handleDiscordLogin}
            className="w-64 mb-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xl py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <MessageSquare className="w-6 h-6 mr-2" />
            Login with Discord
          </Button>
        ) : (
          <div className="mb-8 text-center bg-indigo-900 rounded-lg p-4 border-2 border-indigo-400">
            <p className="text-xl font-semibold text-indigo-200">Welcome, {user.username}!</p>
            <p className="text-indigo-300">Platform: {user.platform}</p>
            <p className="text-2xl font-bold text-cyan-400 mt-2 flex items-center justify-center">
              <Droplet className="inline-block mr-2" />
              {user.gooBalance} Venom Goo
            </p>
            <Button
              onClick={toggleGooRecharge}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
            >
              {showGooRecharge ? (
                <>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Return to Shop
                </>
              ) : (
                <>
                  <Droplet className="w-5 h-5 mr-2" />
                  Recharge Venom Goo
                </>
              )}
            </Button>
          </div>
        )}

        {showGooRecharge ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-gray-700 p-4 rounded-lg border-4 border-gray-600">
            {Object.entries(gooPacks).map(([code, pack]) => (
              <div
                key={code}
                className={`${pack.color} text-white p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-lg`}
                onClick={() => handleGooPackPurchase(code)}
              >
                <h2 className="text-xl font-bold mb-2 text-center">{pack.name}</h2>
                <Droplet className="w-12 h-12 mb-2" />
                <p className="text-white font-bold text-center">
                  {pack.amount} Goo for ${pack.price}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-gray-700 p-4 rounded-lg border-4 border-gray-600"
            style={{ minHeight: '400px' }}
          >
            {Object.entries(products).map(([code, item]) => (
              <div
                key={code}
                className={`${item.color} text-white p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-lg`}
                onClick={() => handleProductSelect(code)}
              >
                <h2 className="text-xl font-bold mb-2 text-center">{code}</h2>
                {item.icon}
                <p className="text-white font-bold mt-2">{item.price} Goo</p>
              </div>
            ))}
          </div>
        )}

        {!showGooRecharge && (
          <div className="w-full max-w-md flex flex-col items-center space-y-4">
            <Input
              type="text"
              placeholder="Enter product code"
              value={inputCode}
              onChange={handleInputChange}
              className="text-center text-2xl h-12"
              maxLength={2}
            />
            <Button
              onClick={handlePurchase}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Purchase
            </Button>
          </div>
        )}

        {purchaseMessage && (
          <p className="mt-6 text-center font-semibold text-xl text-cyan-400 bg-gray-700 rounded-lg p-4 border-2 border-cyan-400">
            {purchaseMessage}
          </p>
        )}

        {selectedGooPack && (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              selectedPack={selectedGooPack}
              discordId={user.discordId}
              setPurchaseMessage={setPurchaseMessage}
              setSelectedGooPack={setSelectedGooPack}
              refreshUserData={refreshUserData}
              BACKEND_URL={BACKEND_URL} // Pasamos BACKEND_URL al componente CheckoutForm
            />
          </Elements>
        )}

        {selectedProduct && (
          <div className="mt-6 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">{products[selectedProduct]?.name}</h2>
            <p>{products[selectedProduct]?.description}</p>
          </div>
        )}

        <footer className="mt-8 text-center text-gray-400 border-t border-gray-700 pt-4 w-full">
          <p>All purchases are final. No refunds under any circumstances.</p>
          <p>In this shop, purchases are made with Venom Goo. 1 USD = 100 Venom Goo.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
