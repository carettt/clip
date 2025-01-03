{
  description = "clip, a test environment for test-driven development";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
        nativeBuildInputs = [
          pkgs.nodejs_22
          pkgs.nodePackages.typescript-language-server
          pkgs.nodePackages.typescript
        ];

        shellHook = ''
          ${pkgs.cowsay}/bin/cowsay "entered dev env!" | ${pkgs.lolcat}/bin/lolcat -F 0.5
        '';
        };
      });
}
