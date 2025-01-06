export const MOBILE_NO_VALIDATOR_REGEX = /^(?:\+88)?01[2-9]\d{8}$/;
export const HOTLINE_NUMBER = "09610016778";
export const FILE_MAX_SIZE = 10000000; // 10MB

export const monthsWithId = [
    {
        id: "01",
        name: "January",
    },
    {
        id: "02",
        name: "February",
    },
    {
        id: "03",
        name: "March",
    },
    {
        id: "04",
        name: "April",
    },
    {
        id: "05",
        name: "May",
    },
    {
        id: "06",
        name: "June",
    },
    {
        id: "07",
        name: "July",
    },
    {
        id: "08",
        name: "August",
    },
    {
        id: "09",
        name: "September",
    },
    {
        id: "10",
        name: "October",
    },
    {
        id: "11",
        name: "November",
    },
    {
        id: "12",
        name: "December",
    },
];

export const TINY_MCE_EDITOR_INIT: object = {
    placeholder: "Type here...",
    height: 600,
    content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    importcss_append: true,
    template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
    template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
    image_caption: true,
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: "sliding",
    contextmenu: "link image table",
    plugins:
        "print preview paste importcss searchreplace autolink save directionality code visualblocks visualchars fullscreen image link media  codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons",
    toolbar:
        "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media link anchor codesample | ltr rtl",
    quickbars_selection_toolbar:
        "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
};
