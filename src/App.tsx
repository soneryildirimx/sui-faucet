import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
    const wallet = useWallet();

    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        if (!wallet.connected) setAddress("");
        if (wallet.address) setAddress(wallet.address);
    }, [wallet.connected]);

    const handleTransfer = async () => {
        toast("Sending..", {
            isLoading: true,
            toastId: "sending",
        });

        try {
            const response = await fetch("https://faucet.devnet.sui.io/gas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    FixedAmountRequest: {
                        recipient: address,
                    },
                }),
            });
            toast("Success", {
                type: "success",
            });
        } catch (error) {
            toast("Something went wrong. Try again later.", {
                type: "error",
            });
        } finally {
            toast.dismiss("sending");
        }
    };

    return (
        <div className="h-screen grid place-items-center">
            <div className="max-w-md w-full">
                <div className="flex justify-center">
                    <ConnectButton className="bg-lime-300 text-black rounded-lg hover:bg-lime-500" />
                </div>
                <div className="flex items-center gap-6 my-6">
                    <div className="w-full h-[2px] bg-gray-300"></div>
                    <div>OR</div>
                    <div className="w-full h-[2px] bg-gray-300"></div>
                </div>
                <div>
                    <div>
                        <div>
                            <input
                                type="text"
                                value={address}
                                disabled={wallet.connected}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Your SUI Wallet Address"
                            />
                            {wallet.connected && (
                                <button
                                    onClick={wallet.disconnect}
                                    className="text-xs text-gray-600 underline"
                                >
                                    Disconnect wallet
                                </button>
                            )}
                        </div>

                        {address.length > 0 && (
                            <button
                                onClick={handleTransfer}
                                className="bg-lime-300 rounded h-10  mt-6 w-full text-black font-semibold hover:bg-lime-500"
                            >
                                Get SUI
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
