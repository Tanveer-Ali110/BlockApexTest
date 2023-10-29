import { ethers } from "hardhat";

export const createFixtures = async (): Promise<any> => {

  const OrderPlace = await ethers.getContractFactory("OrderPlace");
  const contract = await OrderPlace.deploy(
    "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
  );

  return { contract };
};
