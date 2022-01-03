{
  description = "react turn based game";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, ... }:
    # utils.lib.eachDefaultSystem (system:
    let
      system = "x86_64-linux";

      inherit (lib) attrValues;
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ ];
      };
      lib = pkgs.lib;

      client = pkgs.stdenv.mkDerivation {
        name = "turn-game-client";
        src = ./.;

      };

      # run this service as a nixos module
      turnBasedGameModule = { config, options, lib, pkgs, ... }:
        with lib;
        let cfg = config.turn-game;
            user = "turn-game";
            group = "turn-game";
        in {
          options.turn-game = with lib; {
            enable = mkEnableOption false;
          };

          config = mkIf cfg.enable {
            # create a user in which to run the web app
            users.users.turn-game = {
              inherit group;
              isSystemUser = true;
            };

            users.groups.turn-based-game = {};

            # configure a systemd service to launh it
            systemd.services.turn-game = {
              enable = true;
              aliases = [ "turn-game" ];
              after = [ "network.target" ];
              path = with pkgs; [ openssl ];
              serviceConfig = {
                User = user;
                Group = group;
                ExecStart = "${isntweb-bundle}/bin/isntweb-serve";
                PrivateTmp = "true";
                PrivateDevices = "true";
                ProtectHome = "true";
                ProtectSystem = "strict";
                StateDirectory = "turn-game";
              };
              wantedBy = [ "multi-user.target" ];
            };
          };
        }
      ;
      # 1. `yarn` in root directory to install dependencies
      # 2. yarn build

    in rec {
      # packages.turn-game = isntweb-bundle;
      # apps.turn-game = packages.isntweb-home;
      # defaultPackage.${system} = isntweb-bundle;

      nixosModules.turn-game = turnBasedGameModule;
      nixosModule = nixosModules.turn-game;

      devShell.${system} = with pkgs; mkShell {
        buildInputs = [
          # web development
          nodejs
          nodePackages.yarn
        ];

        # don't warn for dead code, unused imports or unused variables
        RUSTFLAGS = "-A dead_code -A unused_imports -A unused_variables";
      };
    };
}
