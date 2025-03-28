import { useEffect, useState } from 'react';

const useNavbarColor = () => {
    const [navbarColor, setNavbarColor] = useState('');
    const [textColor, setTextColor] = useState('');


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 5) {
                setNavbarColor('bg-black');
                setTextColor('text-white');
            } else{
                setNavbarColor('');
                setTextColor('text-black');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { navbarColor, textColor };
};

export default useNavbarColor;
