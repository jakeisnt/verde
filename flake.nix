{
  description = "isnt.online website";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";

    # Used for shell.nix
    flake-compat = {
      url = github:edolstra/flake-compat;
      flake = false;
    };
  };

  outputs = { self, nixpkgs, utils, ... } @ inputs:
    utils.lib.eachDefaultSystem (system:
      let
        inherit (lib) attrValues;
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

      in rec {
        devShell = with pkgs; mkShell {
          name = "home";
          buildInputs = [
            nodejs
          ];
        };
      });
}
