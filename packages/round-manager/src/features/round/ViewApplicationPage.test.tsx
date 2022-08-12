import {makeGrantApplicationData, makeProjectCredentialData, renderWrapped} from "../../test-utils";
import ViewApplicationPage from "./ViewApplicationPage";
import {screen} from "@testing-library/react"
import {useListRoundsQuery} from "../api/services/round"
import {useListGrantApplicationsQuery, useUpdateGrantApplicationMutation} from "../api/services/grantApplication";
import {useSwitchNetwork, useDisconnect} from "wagmi";

/*jest.mock("../api/services/grantApplication", () => ({
    useListGrantApplicationsQuery: () => ({application: makeGrantApplicationData(), isLoading: false}),
    useUpdateGrantApplicationMutation: () => ([()=> {}, {isLoading: false}])
}));*/
jest.mock("../api/services/grantApplication");
jest.mock("wagmi");
jest.mock("../api/services/round");
jest.mock("@gitcoinco/passport-sdk-verifier");
jest.mock("../common/Auth", () => ({
    useWallet: () => ({provider: {}})
}))

describe('ViewApplicationPage', () => {

    it('shows no project github verification', async () => {
        const noGithubVerification = {
            application: makeGrantApplicationData(),
            isLoading: false
        };
        (useListGrantApplicationsQuery as any).mockReturnValue(noGithubVerification);
        (useUpdateGrantApplicationMutation as any).mockReturnValue([jest.fn(), {isLoading: false}]);
        (useListRoundsQuery as any).mockReturnValue({round: {}});
        (useSwitchNetwork as any).mockReturnValue({chains: []});
        (useDisconnect as any).mockReturnValue({});

        await renderWrapped(<ViewApplicationPage/>);

        expect(screen.queryByTestId("github-verified-credential")).not.toBeInTheDocument();
    });

    it('shows project github verification', async () => {
        const verifiedGithubCredential = {
            application: makeGrantApplicationData({},
{credentials: {"github": makeProjectCredentialData()}})
        };
        (useListGrantApplicationsQuery as any).mockReturnValue(verifiedGithubCredential);
        (useUpdateGrantApplicationMutation as any).mockReturnValue([jest.fn(), {isLoading: false}]);
        (useListRoundsQuery as any).mockReturnValue({round: {}});
        (useSwitchNetwork as any).mockReturnValue({chains: []});
        (useDisconnect as any).mockReturnValue({});

        await renderWrapped(<ViewApplicationPage/>);

        expect(screen.queryByTestId("github-verified-credential")).toBeInTheDocument();
    });
});