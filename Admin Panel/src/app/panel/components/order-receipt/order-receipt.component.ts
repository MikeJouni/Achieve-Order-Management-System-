import { Component, ElementRef, OnInit, Input } from "@angular/core";
import { create, SheetsRegistry } from "jss";
import preset from "jss-preset-default";
import { TranslationService } from '../../../services/translation.service';

const jss = create(preset());
const styles = {
  fontMono: {
    fontFamily: "monospace"
  },
};
const sheets = new SheetsRegistry();
const sheet = jss.createStyleSheet(styles);
sheets.add(sheet);
const { classes } = sheet.attach();


@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styleUrls: ['./order-receipt.component.scss']
})
export class OrderReceiptComponent implements OnInit {

  constructor(
    private elementRef: ElementRef,
    public translationService: TranslationService,
    ) {
      this.getCompanyType()
     }

  @Input() width: "77mm";
  @Input() orderDetailData: any;
  classes = classes;

  ngOnInit() {
  }
  companyType:any;
  getCompanyType(){
    if (localStorage.getItem('companyType')) {
      this.companyType = localStorage.getItem('companyType')
    }
  }

  print(): void {
    const tpm = new ThermalPrinterService(this.width);
    const styles = sheets.toString();
    tpm.setStyles(styles);
    tpm.addRawHtml(this.elementRef.nativeElement.innerHTML);
    tpm.print();
  }
}

class ThermalPrinterService {
  printContent = ``;
  cssStyles = ``;

  constructor(private paperWidth: "80mm" | "77mm") { }

  addRawHtml(htmlEl) {
    this.printContent += `\n${htmlEl}`;
  }

  addLine(text) {
    this.addRawHtml(`<p>${text}</p>`);
  }

  addLineWithClassName(className, text) {
    this.addRawHtml(`<p class="${className}">${text}</p>`);
  }

  addEmptyLine() {
    this.addLine(`&nbsp;`);
  }

  addLineCenter(text) {
    this.addLineWithClassName("text-center", text);
  }

  setStyles(cssStyles) {
    this.cssStyles = cssStyles;
  }

  print() {
    const printerWindow = window.open(``, `_blank`);
    printerWindow.document.write(`
    <!DOCTYPE html>
    <html>

    <head>
      <title>Print</title>
      <style>

        html { padding: 0; margin: 0; width: ${this.paperWidth}; }
        body { margin: 0; }
    ${this.cssStyles}

    .print_area_container {
      padding: 2px;
    }

    .normal_font {
      font-size: 16px;
    }

    .font_18px {
      font-size: 18px !important;
    }

    .height_2_px {
      height: 2px;
    }

    .height_5_px {
      height: 5px;
    }

    .text_center {
      text-align: center;
    }

    .text_right {
      text-align: right;
    }

    .text_left {
      text-align: left;
    }

    .print_area_container[dir="ltr"] .text_reverse {
      text-align: right !important;
    }

    .print_area_container[dir="rtl"] .text_reverse {
      text-align: left !important;
    }

    .grid_2_col {
      display: grid;
      column-gap: 5px;
      grid-template-columns: auto auto;
    }

    .grid_4_col {
      display: grid;
      column-gap: 5px;
      grid-template-columns: 4fr 2fr 1fr 3fr;
    }

    .grid_border_solid {
      border-bottom: 1px solid;
    }

    .grid_border_double {
      border-bottom: 3px double;
    }

    .grid_border {
      grid-column: 1 / -1;
      margin: 4px 0;
    }

    .margin_b_0 {
      margin-bottom: 0;
    }


      </style>
      <script>
        window.onafterprint = event => {
          window.close();
        };
      </script>
    </head>

    <body>
      ${this.printContent}
    </body>

    </html>

    `);

    printerWindow.document.close();
    printerWindow.focus();
    printerWindow.print();
    // mywindow.close();
  }

}
