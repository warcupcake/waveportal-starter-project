import React from 'react';

class ConnectWalletButton extends React.Component{
    render() {
        return(
            <div>
                {!this.props.currentAccount && (
                    <button className="connectButton" onClick={this.props.connectWallet}>
                        Connect Wallet
                    </button>
                )}
            </div>
            )
    }
}

export default ConnectWalletButton;