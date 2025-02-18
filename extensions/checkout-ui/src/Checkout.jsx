import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension, sessionToken } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  // Make sure APP_URL is set correctly
  const apiUrl = `${process.env.APP_URL}/api/additional`;
  // console.log("API URL:", apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await sessionToken.get();
        // console.log("Session Token:", token);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, sessionToken]);

  // 2. Check instructions for feature availability
  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="checkout-ui" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="checkout-ui">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>
      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}

// // import {
//   reactExtension,
//   useApi,
//   Button,
//   Link,
//   Modal,
//   TextBlock,
// } from "@shopify/ui-extensions-react/checkout";
// import { ScrollView } from "@shopify/ui-extensions/checkout";

// export default reactExtension("purchase.checkout.block.render", () => (
//   <Extension />
// ));

// function Extension() {
//   const { ui } = useApi();
//   const data = (id) => () => {
//     console.log("Button clicked with ID:", id);
//     ui.overlay.close("my-modal");
//   };
//   return (
//     <Button
//       overlay={
//         <Modal id="my-modal" padding title="Return policy">
//           <ScrollView>
//             <TextBlock>
//               We have a 30-day return policy, which means you have 30 days after
//               receiving your item to request a return.
//             </TextBlock>
//             <TextBlock>
//               To be eligible for a return, your item must be in the same
//               condition that you received it, unworn or unused, with tags, and
//               in its original packaging. You’ll also need the receipt or proof
//               of purchase.
//             </TextBlock>
//             <Button onPress={data(1)}>Close</Button>
//           </ScrollView>
//         </Modal>
//       }
//     >
//       Return policy
//     </Button>
//   );
// }
