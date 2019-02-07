const interf = '[{"constant":true,"inputs":[],"name":"auctionSeller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidderLog","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"auctionLedger","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionHasEnded","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionBegin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minIncrementValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"highestBidder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"auctionManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reserveValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidLog","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ipfsHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"highestBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"placeBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"endAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_reserveValue","type":"uint256"},{"name":"_minIncrementValue","type":"uint256"},{"name":"_auctionDuration","type":"uint256"},{"name":"_ipfsHash","type":"string"}],"payable":true,"stateMutability":"payable","type":"constructor"}]';
const bytecode = '6080604052604051610a84380380610a84833981016040908152815160208301519183015160608401519193909101655af3107a400034116100c857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f596f75206d7573742070617920746865206164766572746973656d656e74206660448201527f6565000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b60008054600160a060020a03191673e3e36c15027be15aeabf2a71f6920a9429aa893717808255604051600160a060020a0391909116913480156108fc02929091818181858888f19350505050158015610126573d6000803e3d6000fd5b50670de0b6b3a76400008085026006558302600755426008819055820160095560018054600160a060020a03191633179055600a805460ff19169055805161017590600b906020840190610222565b5060038054600160a060020a031916739d7c1161d3726313627bc4cdfa0c7acbc87efed51790819055604080517f38eada1c0000000000000000000000000000000000000000000000000000000081523060048201529051600160a060020a0392909216916338eada1c9160248082019260009290919082900301818387803b15801561020157600080fd5b505af1158015610215573d6000803e3d6000fd5b50505050505050506102bd565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061026357805160ff1916838001178555610290565b82800160010185558215610290579182015b82811115610290578251825591602001919060010190610275565b5061029c9291506102a0565b5090565b6102ba91905b8082111561029c57600081556001016102a6565b90565b6107b8806102cc6000396000f3006080604052600436106100e55763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630cf9181681146100ea5780631973b9ab1461011b5780632a24f46c1461013357806337271cc71461015a57806348458af514610171578063485994e81461018657806349a5b880146101af5780637d1921ec146101c457806391f90157146101d9578063b0192f9a146101ee578063b3a1687214610203578063c3c941fc14610218578063c623674f14610230578063d57bde79146102ba578063ecfc7ecc146102cf578063fe67a54b146102d7575b600080fd5b3480156100f657600080fd5b506100ff6102ec565b60408051600160a060020a039092168252519081900360200190f35b34801561012757600080fd5b506100ff6004356102fb565b34801561013f57600080fd5b50610148610323565b60408051918252519081900360200190f35b34801561016657600080fd5b5061016f610329565b005b34801561017d57600080fd5b506100ff610387565b34801561019257600080fd5b5061019b610396565b604080519115158252519081900360200190f35b3480156101bb57600080fd5b5061014861039f565b3480156101d057600080fd5b506101486103a5565b3480156101e557600080fd5b506100ff6103ab565b3480156101fa57600080fd5b506100ff6103ba565b34801561020f57600080fd5b506101486103c9565b34801561022457600080fd5b506101486004356103cf565b34801561023c57600080fd5b506102456103ee565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561027f578181015183820152602001610267565b50505050905090810190601f1680156102ac5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156102c657600080fd5b5061014861047c565b61016f610482565b3480156102e357600080fd5b5061016f6106f3565b600154600160a060020a031681565b600c80548290811061030957fe5b600091825260209091200154600160a060020a0316905081565b60095481565b600254600090600160a060020a031633141561034157fe5b5033600081815260056020526040808220805490839055905190929183156108fc02918491818181858888f19350505050158015610383573d6000803e3d6000fd5b5050565b600354600160a060020a031681565b600a5460ff1681565b60085481565b60075481565b600254600160a060020a031681565b600054600160a060020a031681565b60065481565b600d8054829081106103dd57fe5b600091825260209091200154905081565b600b805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b505050505081565b60045481565b600a5460ff16156104dd576040805160e560020a62461bcd02815260206004820152601160248201527f41756374696f6e2068617320656e646564000000000000000000000000000000604482015290519081900360640190fd5b3360009081526005602052604090205415610568576040805160e560020a62461bcd02815260206004820152602360248201527f596f75206d75737420776974686472617720796f75722070726576696f75732060448201527f6269640000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b6006543410156105c2576040805160e560020a62461bcd02815260206004820152601e60248201527f526573657276652076616c756520686173206e6f74206265656e206d65740000604482015290519081900360640190fd5b600754600254600160a060020a031660009081526005602052604090205401341015610638576040805160e560020a62461bcd02815260206004820152601960248201527f4d696e696d756d20696e6372656d656e74206e6f74206d657400000000000000604482015290519081900360640190fd5b3360008181526005602052604081208054349081019091556002805473ffffffffffffffffffffffffffffffffffffffff19908116909417908190556004918255600c805460018181019092557fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7018054909516600160a060020a03929092169190911790935554600d805493840181559091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb590910155565b60008054600160a060020a0316331461070857fe5b5060085460095442829003918201111561072a57600a805460ff191660011790555b600a5460ff161515600114610789576040805160e560020a62461bcd02815260206004820152601560248201527f41756374696f6e20686173206e6f7420656e6465640000000000000000000000604482015290519081900360640190fd5b505600a165627a7a723058200ccbc89f2a1ca68dd6a0cb6e40677789bb0790d828bd13726a1eafe365d0f50b0029';
const ledger = '[{"constant":false,"inputs":[{"name":"auctionAddress","type":"address"}],"name":"addAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAuctions","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';

const contract = {interf: interf,bytecode: bytecode, ledger: ledger};

export default contract;