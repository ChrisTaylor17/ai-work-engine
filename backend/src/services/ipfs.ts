import axios from 'axios';

export interface IPFSUploadResult {
  hash: string;
  url: string;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private pinataBaseUrl = 'https://api.pinata.cloud';

  constructor() {
    this.pinataApiKey = process.env.IPFS_API_KEY || '';
    this.pinataSecretKey = process.env.IPFS_SECRET_KEY || '';
  }

  async uploadJSON(data: any, name?: string): Promise<IPFSUploadResult> {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        // Return mock hash for development
        const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
        return {
          hash: mockHash,
          url: `https://gateway.pinata.cloud/ipfs/${mockHash}`
        };
      }

      const response = await axios.post(
        `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        {
          pinataContent: data,
          pinataMetadata: {
            name: name || `ai-decision-${Date.now()}`
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      const hash = response.data.IpfsHash;
      return {
        hash,
        url: `https://gateway.pinata.cloud/ipfs/${hash}`
      };
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error}`);
    }
  }

  async uploadDecisionLog(
    decisionType: string,
    context: any,
    result: any,
    timestamp: Date = new Date()
  ): Promise<IPFSUploadResult> {
    const logData = {
      decisionType,
      context,
      result,
      timestamp: timestamp.toISOString(),
      version: '1.0',
      platform: 'ai-work-engine'
    };

    return this.uploadJSON(logData, `decision-log-${decisionType}-${timestamp.getTime()}`);
  }

  async retrieveData(hash: string): Promise<any> {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
      return response.data;
    } catch (error) {
      throw new Error(`IPFS retrieval failed: ${error}`);
    }
  }

  async pinHash(hash: string, name?: string): Promise<boolean> {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        return true; // Mock success for development
      }

      await axios.post(
        `${this.pinataBaseUrl}/pinning/pinByHash`,
        {
          hashToPin: hash,
          pinataMetadata: {
            name: name || `pinned-${Date.now()}`
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      return true;
    } catch (error) {
      console.error('IPFS pinning failed:', error);
      return false;
    }
  }

  isValidHash(hash: string): boolean {
    // Basic IPFS hash validation
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
  }
}