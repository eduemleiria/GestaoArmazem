import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img className="object-fit" src="/logo.svg" alt="App Logo" {...props} />;
}
