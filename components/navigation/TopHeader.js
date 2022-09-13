const TopHeader = () => {

    return (
        <>
            {/* <div id="triangle-right"></div> */}
            <div className="flex flex-1 justify-end bg-white">
                <div className="pr-8 grid grid-rows-1 grid-flow-col gap-8 items-center h-[65px] bg-white">

                    <div className="text-gray-800 hover:text-cyan-500">
                        <button>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                First Button
                            </div>
                        </button>
                    </div>

                    <div className="text-gray-800 hover:text-red-500">
                        <button>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                        clipRule="evenodd" />
                                </svg>
                                Second Button
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopHeader
