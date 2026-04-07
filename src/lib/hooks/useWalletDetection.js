import { useState, useEffect } from 'react';

export function useWalletDetection() {
  const [wallets, setWallets] = useState([]);
  const [checked, setChecked] = useState(false);

  const detect = () => {
    const found = [];
    const eth = window.ethereum;
    if (eth) {
      const providers = eth.providers ?? [eth];
      for (const p of providers) {
        if (p.isMetaMask && !p.isRabby && !p.isBraveWallet && !found.find(x => x.id === 'metamask'))
          found.push({ id: 'metamask', name: 'MetaMask', icon: '🦊' });
        if (p.isRabby && !found.find(x => x.id === 'rabby'))
          found.push({ id: 'rabby', name: 'Rabby', icon: '🐇' });
        if ((p.isCoinbaseWallet || p.isCoinbaseBrowser) && !found.find(x => x.id === 'coinbase'))
          found.push({ id: 'coinbase', name: 'Coinbase', icon: '🔵' });
        if (p.isBraveWallet && !found.find(x => x.id === 'brave'))
          found.push({ id: 'brave', name: 'Brave Wallet', icon: '🦁' });
        if ((p.isTrust || p.isTrustWallet) && !found.find(x => x.id === 'trust'))
          found.push({ id: 'trust', name: 'Trust Wallet', icon: '🛡️' });
        if ((p.isOKExWallet || p.isOkxWallet) && !found.find(x => x.id === 'okx'))
          found.push({ id: 'okx', name: 'OKX Wallet', icon: '⭕' });
      }
    }
    if (window.solana?.isPhantom && !found.find(x => x.id === 'phantom'))
      found.push({ id: 'phantom', name: 'Phantom', icon: '👻' });
    if (window.phantom?.solana?.isPhantom && !found.find(x => x.id === 'phantom'))
      found.push({ id: 'phantom', name: 'Phantom', icon: '👻' });
    setWallets(found);
    setChecked(true);
  };

  useEffect(() => {
    const t = setTimeout(detect, 300);
    window.addEventListener('focus', detect);
    return () => { clearTimeout(t); window.removeEventListener('focus', detect); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { wallets, checked };
}
