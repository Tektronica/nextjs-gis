import Link from 'next/link'

const Navbar = () => {

    return (
        <div className='flex flex-col flex-1 bg-gradient-to-b from-zinc-800 via-zinc-800 to-zinc-900'>
            <div className='h-[65px] bg-cyan-600 shadow-md shadow-cyan-800 flex justify-center'>
                <div className='text-white text-2xl'>
                    <Link href='/'>
                        <a className="flex items-center h-[65px]">
                            FlightPlanner
                        </a>
                    </Link>
                </div>
            </div>

            <div className="flex-grow p-4">

                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/flightpath'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </span>
                            Flight Path
                        </a>
                    </Link>
                </div>

                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </span>
                            Small Examples
                        </a>
                    </Link>
                </div>

                <div className="pb-4 text-gray-400 hover:text-white">
                    <Link href='/history'>
                        <a className="flex items-center">
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </span>
                            History
                        </a>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Navbar
