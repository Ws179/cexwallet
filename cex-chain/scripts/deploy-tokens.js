const { ethers } = require("hardhat");
//测试地址
const RECIPIENT_ADDRESS = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";

async function main() {
  console.log("开始部署 USDT 代币合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("部署者地址:", deployer.address);
  console.log("部署者余额:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 部署 USDT 合约
  console.log("\n部署 USDT 合约...");
  const USDT = await ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("USDT 合约地址:", usdtAddress);

  // 获取代币信息
  console.log("\n=== 代币信息 ===");
  console.log("\nUSDT 名称:", await usdt.name());
  console.log("USDT 符号:", await usdt.symbol());
  console.log("USDT 精度:", await usdt.decimals());
  console.log("USDT 总供应量:", ethers.formatUnits(await usdt.totalSupply(), 6));

  // 将部署者持有的合约余额一半转给指定钱包地址，本地测试用，metamask钱包无usdt余额，所以需要手动转账
  const deployerTokenBalance = await usdt.balanceOf(deployer.address);
  const transferAmount = deployerTokenBalance / 2n;
  const transfer = await usdt.transfer(RECIPIENT_ADDRESS, transferAmount);
  await transfer.wait();

  console.log("\n=== 初始 USDT 转账 ===");
  console.log("接收地址:", RECIPIENT_ADDRESS);
  console.log("转账金额:", ethers.formatUnits(transferAmount, 6), "USDT");
  console.log("交易哈希:", transfer.hash);
////////////////////////////////////////////////////////////////////////////////////////////////////
  // 检查部署者余额
  console.log("\n=== 部署者代币余额 ===");
  console.log("USDT 余额:", ethers.formatUnits(await usdt.balanceOf(deployer.address), 6));
  console.log("接收地址余额:", ethers.formatUnits(await usdt.balanceOf(RECIPIENT_ADDRESS), 6));

  console.log("\n部署完成！");
  console.log("USDT 合约地址:", usdtAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
