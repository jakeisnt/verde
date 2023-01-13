{
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
        name = "verde";
        description = "game application framework";

        inherit (lib) attrValues;
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

      in rec {
        devShell = with pkgs; mkShell {
          inherit name description;
          buildInputs = [
            nodejs
            yarn
            nodePackages_latest.typescript
          ];
        };
      });
}
