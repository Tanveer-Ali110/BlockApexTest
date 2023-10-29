import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import chai, { assert, expect } from "chai";
import { waffle } from "hardhat";
import { createFixtures } from "./shared/fixture";
import { Contract } from "@ethersproject/contracts";

chai.use(waffle.solidity);

describe("OrderPlace", () => {
  const { provider } = waffle;
  const [owner, buyAsset, sellAsset] = provider.getWallets();

  let contract: Contract;
  let executionTime: number;

  before(async () => {
    const fixture = await loadFixture(createFixtures);
    contract = fixture.contract;
    executionTime = (await time.latest()) + time.duration.days(5);
  });

  it("Should set the right owner", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("should place an order", async () => {
    await contract.placeOrder(
      buyAsset.address,
      sellAsset.address,
      100, // amount
      0, // ConditionType.TimeBased
      executionTime
    );
    const order = await contract.orders(0);
    assert.equal(order.user, owner.address, "Order placed by the wrong user");
    assert.equal(order.assetToBuy, buyAsset.address, "Incorrect asset to buy");
    assert.equal(
      order.assetToSell,
      sellAsset.address,
      "Incorrect asset to sell"
    );
    assert.equal(order.amount, 100, "Incorrect amount");
    assert.equal(order.conditionType, 0, "Incorrect condition type");
    assert.isAbove(
      order.executionTime,
      Math.floor(Date.now() / 1000),
      "Incorrect execution time"
    );
    assert.equal(
      order.orderExecuted,
      false,
      "Order should not be executed yet"
    );
  });

  it("should failed before execution time", async () => {
    const beforeExecutionTime = (await time.latest()) + time.duration.days(4);
    await time.increaseTo(beforeExecutionTime);
    await contract.executeOrders(0);
    const order = await contract.orders(0);
    assert.equal(order.orderExecuted, false, "Order should be executed now");
  });
  it("should execute orders", async () => {
    await time.increaseTo(executionTime);
    await contract.executeOrders(0);
    const order = await contract.orders(0);
    assert.equal(order.orderExecuted, true, "Order should be executed now");
  });
  it("should failed already execute orders", async () => {
    await time.increaseTo(executionTime + 10);
    await expect(contract.executeOrders(0)).to.be.revertedWith(
      "Order already executed"
    );
  });
  it("should toggle pause state", async () => {
    await contract.togglePause();
    const isPaused = await contract.isPause();
    assert.equal(isPaused, true, "Contract should be paused");
  });
  it("should failed to place an order", async () => {
    const order = contract.placeOrder(
      buyAsset.address,
      sellAsset.address,
      100, // amount
      0, // ConditionType.TimeBased
      executionTime
    );
    await expect(order).to.be.revertedWith("Contract is in emergency stop");
  });
});
