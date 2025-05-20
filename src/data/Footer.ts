interface IFooterPolicy {
  id: number;
  href: string;
  text: string;
}

export const FooterPolicy: IFooterPolicy[] = [
  {
    id: 1,
    href: "/privacy-policy",
    text: "Privacy Policy",
  },
  {
    id: 2,
    href: "/return-&-refund",
    text: "Return and Refund Policy",
  },
  {
    id: 3,
    href: "/shipping-policy",
    text: "Shipping Policy",
  },
  {
    id: 4,

    href: "/terms-&-conditions",
    text: "Terms and Conditions",
  },
];
