import { BaseProvider } from '../BaseProvider';
import { SupportedChains } from '../../types/Provider';
import { Wepin } from '../../wepin';
export default class InpageProvider extends BaseProvider {
    constructor({ network, wepin, }: {
        network: Partial<SupportedChains>;
        wepin: Wepin;
    });
    static generate(params: any): InpageProvider;
}
