export function SvgFilters() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter id="dissolve-filter" colorInterpolationFilters="sRGB" height="600%" width="600%" x="-300%" y="-300%">
          <feTurbulence baseFrequency="0.015" numOctaves="1" result="bigNoise" type="fractalNoise"></feTurbulence>
          <feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
            <feFuncR intercept="-0.2" slope="0.5" type="linear"></feFuncR>
            <feFuncG intercept="-0.6" slope="3" type="linear"></feFuncG>
          </feComponentTransfer>
          <feTurbulence baseFrequency="1" numOctaves="2" result="fineNoise" type="fractalNoise"></feTurbulence>
          <feMerge result="combinedNoise">
            <feMergeNode in="bigNoiseAdjusted"></feMergeNode>
            <feMergeNode in="fineNoise"></feMergeNode>
          </feMerge>
          <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="0" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
        </filter>
      </defs>
    </svg>
  );
}
