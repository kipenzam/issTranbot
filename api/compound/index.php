<?php
$phpRoot = $_SERVER["DOCUMENT_ROOT"].'/_php/';
require_once($phpRoot.'01_generals.php');
#require_once($phpRoot.'05_markups.php');
#require_once($phpRoot.'06_iss_constants.php');
#http://intranet.isangseung.co.kr/issTranbot/00_word/api/compound/

$sql = "SELECT en, pumsa FROM contract.dbo.master_word WHERE en != '' AND en LIKE '% %' AND pumsa != ''
ORDER BY Len(en) DESC, en, pumsa";
$obj = fetchClass($sql);

$array = "import re
db = {";
foreach ($obj as $r) {
    $array .= "
    '$r->en': '$r->pumsa',";
}
$array .= "
}


def do(tagged, line):
    print('')
    print('')
    print(line)
    for compound in db:
        if line.lower().find(compound.lower()) >= 0:
            print('>>> ' + compound)
            tagged = main(tagged, compound)

    return tagged

def main(tagged, compound):
    word = compound.split(' ')
    print(compound)
    print(' => ')
    print(word)
    out = []

    is_matching = False
    matching = []
    j = 0
    for i in range(0, len(tagged)):
        if not is_matching:
            if tagged[i][0].lower() == word[j].lower():
                matching.append(tagged[i][0])
                is_matching = True
                j += 1
            else:
                out.append(tagged[i])
                is_matching = False
                j = 0

        else:
            if tagged[i][0].lower() == word[j].lower():
                matching.append(tagged[i][0])
                j += 1
                if j >= len(word):
                    out.append( (' '.join(matching), db[compound]) )
                    is_matching = False
                    j = 0
                    matching = []
            else:
                is_matching = False
                j = 0
                out.append( (' '.join(matching), db[compound]) )
                out.append(tagged[i])
                matching = []

    return out";

echo ( strlen($errorLog) > 1? $errorLog: $array );
?>