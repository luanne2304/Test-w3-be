const Daugiacontract = artifacts.require("Daugiacontract");

module.exports = function (deployer) {
  deployer.deploy(Daugiacontract,43200,"0x6E9918f26732C10f2C1fbB754506AF0B4700403C");
};