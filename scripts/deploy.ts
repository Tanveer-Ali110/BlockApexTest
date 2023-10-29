import { ethers } from "hardhat";

async function main() {

  const OrderPlace = await ethers.getContractFactory("OrderPlace");
  const orderPlace = await OrderPlace.deploy("0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e");

  console.log("OrderPlace deployed to:", orderPlace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
