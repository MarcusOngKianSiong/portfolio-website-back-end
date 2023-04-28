const data = [
    {
      id: 1,
      section_title: 'codebase overview',
      section_order_num: 1,
      image_link: 'https://www.researchgate.net/publication/8662258/figure/fig1/AS:601600745816067@1520444203750/Network-interaction-map-Connections-leading-to-node-i-of-the-network-correspond-to.png',
      sub_section_title: 'sub section 2',
      sub_section_order_num: 2,
      content: 'This is sub section 2 for code base overview'
    },
    {
      id: 1,
      section_title: 'codebase overview',
      section_order_num: 1,
      image_link: 'https://www.researchgate.net/publication/8662258/figure/fig1/AS:601600745816067@1520444203750/Network-interaction-map-Connections-leading-to-node-i-of-the-network-correspond-to.png',
      sub_section_title: 'sub section 1',
      sub_section_order_num: 1,
      content: 'This is sub section 1 for code base overview'
    },
    {
      id: 2,
      section_title: 'Code Structure',
      section_order_num: 2,
      image_link: null,
      sub_section_title: 'sub section 2',
      sub_section_order_num: 2,
      content: 'This is sub section 2 for code structure'
    },
    {
      id: 2,
      section_title: 'Code Structure',
      section_order_num: 2,
      image_link: null,
      sub_section_title: 'sub section 1',
      sub_section_order_num: 1,
      content: 'This is sub section 1 for code structure'
    }
  ]

//   {
//     title: 'section 1',	
//     image: 'https://www.researchgate.net/publication/8662258/figure/fig1/AS:601600745816067@1520444203750/Network-interaction-map-Connections-leading-to-node-i-of-the-network-correspond-to.png',
//     subsections: [
//         {
//             title: 'sub section 1',
//             content: 'contenting for sub section 1'
//         },
//         {
//             title: 'sub section 2',
//             content: 'contenting for sub section 2'
//         }
//     ]
// }

  function dataFormat(data){

        const theData = []
        const sectionTitle = []
        const sectionImage = []
        const order_num = []
        const subSections = []
        // Create the sections and order them accordingly 
        data.forEach(piece=>{
            sectionTitle.push(piece.section_title)
            sectionImage.push(piece.image_link)
            const x = {title: piece.section_title,order_num: piece.section_order_num}
            order_num.push(x)
            const oneSubSection = {
                section: piece.section_title,
                title: piece.sub_section_title,
                content: piece.content,
                order: piece.sub_section_order_num
            }
            subSections.push(oneSubSection)
        })
        
        // FIlter out things that replicated itself
        const uniqueTitles = new Set(sectionTitle);
        const uniqueImages = new Set(sectionImage);
        
        // Combine them into an object stored in an array
        const combinedArray = Array.from(uniqueTitles, (title, index) => ({
            title,
            image: Array.from(uniqueImages)[index] || null,
            subsections: []
          }));
          
          // Combine 
          subSections.forEach(subSection=>{
                const index = combinedArray.findIndex(item=> item.title === subSection.section)
                
                combinedArray[index].subsections.push(subSection)
          })

        //   console.log(combinedArray)
        //   console.log(subSections)

          combinedArray.forEach((section,index)=>{
            section.subsections.sort((a,b)=>{
                if(a.order<b.order){
                    return -1
                }
                if(b.order<a.order){
                    return 1
                }
            })
            
            combinedArray[index] = section
            console.log("CHECKING: ",combinedArray[index])
          })
        return combinedArray       
  }

  module.exports = {dataFormat}

  