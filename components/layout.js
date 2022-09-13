// <-- MAIN LAYOUT -->

import Navbar from "./navigation/Navbar"
import TopHeader from "./navigation/TopHeader"

export default function Layout({ children }) {

    return (
        <>
            <div className="overflow-hidden h-screen bg-neutral-200 flex flex-row justify-center">
                <div className="w-full flex flex-col h-screen bg-white max-w-[1100px] z-50 drop-shadow-lg">
                    <div className="flex flex-1 overflow-hidden bg-slate-200">

                        {/* <!-- left column --> */}
                        <div className="flex min-w-[200px]">
                            <Navbar />
                        </div>

                        {/* <!-- right column --> */}
                        <div className="flex flex-1 flex-col">

                            {/* <!-- top header --> */}
                            <div className="flex h-[65px] top-0 z-50 drop-shadow-md">
                                <TopHeader />
                            </div>
                            <div className="flex flex-1 overflow-y-auto">
                                <div className="grow">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
