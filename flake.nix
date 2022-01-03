{
  description = "react turn based game";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    # inputs.gitignore = {
    #   url = "github:hercules-ci/gitignore.nix";
    #   # Use the same nixpkgs
    #   inputs.nixpkgs.follows = "nixpkgs";
    # };
  };

  outputs = { self, nixpkgs, utils, ... }:
    # utils.lib.eachDefaultSystem (system:
    let
      # inherit (gitignore.lib) gitignoreSource;
      system = "x86_64-linux";

      inherit (lib) attrValues;
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ ];
      };
      lib = pkgs.lib;

      docsrc = ./.;

      # 1. Install the server yarn dependencies
      #    build the client util file
      #    stash the client util file in the build

      # 2. Build the client dependencies
      #    Bake the server util file in so the import resolves

      # 3. Build the full package to let the client deploy the server
      # (just writing a script)
      server-code = (pkgs.mkYarnPackage {
        src = "${./server}";
        packageJSON = "${./server/package.json}";
        yarnLock = "${./yarn.lock}";
        yarnPostBuild = "cd $out/deps/server/deps/server/ && node --experimental-specifier-resolution=node gen-api.js";
      });

      client-code = (pkgs.mkYarnPackage {
        src = "${./client}";
        packageJSON = "${docsrc}/client/package.json";
        yarnLock = "${./yarn.lock}";
        extraBuildInputs = [ server-code ];
      });

      # run this service as a nixos module
      # turnBasedGameModule = { config, options, lib, pkgs, ... }:
      #   with lib;
      #   let cfg = config.turn-game;
      #       user = "turn-game";
      #       group = "turn-game";
      #   in {
      #     options.turn-game = with lib; {
      #       enable = mkEnableOption false;
      #     };

      #     config = mkIf cfg.enable {
      #       # create a user in which to run the web app
      #       users.users.turn-game = {
      #         inherit group;
      #         isSystemUser = true;
      #       };

      #       users.groups.turn-based-game = {};

      #       # configure a systemd service to launh it
      #       systemd.services.turn-game = {
      #         enable = true;
      #         aliases = [ "turn-game" ];
      #         after = [ "network.target" ];
      #         path = with pkgs; [ openssl ];
      #         serviceConfig = {
      #           User = user;
      #           Group = group;
      #           ExecStart = "${isntweb-bundle}/bin/isntweb-serve";
      #           PrivateTmp = "true";
      #           PrivateDevices = "true";
      #           ProtectHome = "true";
      #           ProtectSystem = "strict";
      #           StateDirectory = "turn-game";
      #         };
      #         wantedBy = [ "multi-user.target" ];
      #       };
      #     };
      #   }
      # ;
      # 1. `yarn` in root directory to install dependencies
      # 2. yarn build


    in rec {
      # packages.turn-game = isntweb-bundle;
      # apps.turn-game = packages.isntweb-home;
      defaultPackage.${system} = client-code;

      # nixosModules.turn-game = turnBasedGameModule;
      # nixosModule = nixosModules.turn-game;

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
