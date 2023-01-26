import { Flir } from '../native';

function getVersion(): string {
  return Flir.getVersion();
}

function getCommitHash(): string {
  return Flir.getCommitHash();
}

export { getVersion, getCommitHash };
