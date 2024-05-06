import { ConnectButton } from '@rainbow-me/rainbowkit'
import { iconLogo } from '../assets'
import { Link } from 'react-router-dom'

export const NavMenu = () => {
    return (
        <div className='p-5'>
            <div className='flex items-center justify-between gap-5'>
                <img src={iconLogo} alt={iconLogo} />
                <div className='flex gap-5'>
                    <Link to="/buy" className='text-white text-base hover:text-[#EBB91E]'>
                        Buy
                    </Link>
                    <Link to="/stake" className='text-white text-base hover:text-[#EBB91E]'>
                        Stake
                    </Link>
                </div>
                <ConnectButton />
            </div>
        </div>
    )
}
